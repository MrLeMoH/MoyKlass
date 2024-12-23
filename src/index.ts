import express, { Request, Response } from 'express';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { Lesson, Teacher, Student, sequelize } from './models/index.js';

const app = express();
const port = 3000;

app.use(express.json()); // Для парсинга JSON в теле запроса

// Типы для параметров запроса
interface FilterParams {
    date?: string;
    status?: string;
    teacherIds?: string;
    studentsCount?: string;
    page?: string;
    lessonsPerPage?: string;
}

// Тип результата
interface LessonResponse {
    id: number;
    date: string;
    title: string;
    status: number;
    visitCount: number;
    students: { id: number; name: string; visit: boolean }[];
    teachers: { id: number; name: string }[];
}

// Эндпойнт для получения всех занятий с учителями и студентами
app.post('/lessons', async (req: Request<{}, {}, FilterParams>, res: Response):Promise<any> => {

    try {
        const {
            date,
            status,
            teacherIds,
            studentsCount,
            page = '1',
            lessonsPerPage = '5',
        } = req.body;

        // Параметры фильтрации
        const whereClause: WhereOptions = {};

        // Проверка даты
        if (date) {
            const [startDate, endDate] = date.split(',');
            if (startDate && endDate) {
                whereClause.date = {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                };
            } else if (startDate) {
                whereClause.date = {
                    [Op.eq]: new Date(startDate),
                };
            } else {
                return res.status(400).json({ error: 'Invalid date format' });
            }
        }

        // Проверка статуса
        if (status !== undefined) {
            const statusNum = Number(status);
            if (statusNum !== 0 && statusNum !== 1) {
                return res.status(400).json({ error: 'Status must be 0 or 1' });
            }
            whereClause.status = statusNum;
        }

        // Проверка учителей
        let teacherFilter: WhereOptions | undefined = undefined;
        if (teacherIds) {
            const teacherIdsArray = teacherIds.split(',');
            if (teacherIdsArray.some(id => isNaN(Number(id)))) {
                return res.status(400).json({ error: 'Teacher ids must be numbers' });
            }
            teacherFilter = {
                [Op.or]: teacherIdsArray.map((teacherId) => ({
                    id: {
                        [Op.eq]: Number(teacherId),
                    },
                })),
            };
        }

        // Проверка количества студентов
        let havingClause: WhereOptions | undefined = undefined;
        if (studentsCount) {
            const [minCount, maxCount] = studentsCount.split(',');
            const min = Number(minCount);
            const max = maxCount ? Number(maxCount) : min;
            if (isNaN(min) || (maxCount && isNaN(Number(maxCount)))) {
                return res.status(400).json({ error: 'Students count must be a valid number or range' });
            }

            havingClause = {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Students.id'))),
                        {
                            [Op.gte]: min,
                        }
                    ),
                    Sequelize.where(
                        Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Students.id'))),
                        {
                            [Op.lte]: max,
                        }
                    ),
                ],
            };
        }

        // Пагинация
        const limit = parseInt(lessonsPerPage, 10) || 5;
        const offset = (parseInt(page, 10) - 1) * limit;

        // Запрос к базе данных
        const lessons = await Lesson.findAll({
            where: whereClause,
            include: [
                {
                    model: Teacher,
                    through: { attributes: [] },
                    where: teacherFilter,
                },
                {
                    model: Student,
                    through: { attributes: ['visit'] },
                    required: true, // Это важно для корректного JOIN
                },
            ],
            order: ['id'],
            group: ['Lesson.id'], // Группировка по урокам
            having: havingClause, // Применяем фильтрацию по количеству студентов
            limit,
            offset,
        });

        // Формирование результата
        const result: LessonResponse[] = lessons.map((lesson: any) => {
            const lessonDate = new Date(lesson.date);

            const students = lesson.Students || [];
            const teachers = lesson.Teachers || [];
            return {
                id: lesson.id,
                date: lessonDate.toISOString().split('T')[0], // Форматируем дату в строку YYYY-MM-DD
                title: lesson.title,
                status: lesson.status,
                visitCount: students.filter((student: any) => student.LessonStudent?.visit).length,
                students: students.map((student: any) => ({
                    id: student.id,
                    name: student.name,
                    visit: student.LessonStudent?.visit || false,
                })),
                teachers: teachers.map((teacher: any) => ({
                    id: teacher.id,
                    name: teacher.name,
                })),
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Error fetching lessons' });
    }
});

// Запуск сервера
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
