import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { Lesson } from './Lesson';
import { Teacher } from './Teacher';

export class LessonTeacher extends Model {}

LessonTeacher.init(
    {
        lessonId: {
            type: DataTypes.INTEGER,
            references: {
                model: Lesson,
                key: 'id',
            },
        },
        teacherId: {
            type: DataTypes.INTEGER,
            references: {
                model: Teacher,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'LessonTeacher',
        tableName: 'lesson_teachers',
        timestamps: false,
    }
);

// // Ассоциации
// Lesson.belongsToMany(Teacher, {
//     through: LessonTeacher,
//     foreignKey: 'lessonId',
// });
// Teacher.belongsToMany(Lesson, {
//     through: LessonTeacher,
//     foreignKey: 'teacherId',
// });
