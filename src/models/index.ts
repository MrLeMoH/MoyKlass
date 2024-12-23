import { sequelize } from '../sequelize.js';
import { Lesson } from './Lesson.js';
import { Teacher } from './Teacher.js';
import { Student } from './Student.js';
import { LessonStudent } from './LessonStudent.js';
import {Association, Model} from "sequelize";


// Устанавливаем ассоциации
Lesson.belongsToMany(Student, {
    through: LessonStudent,
    foreignKey: 'lesson_id',
    otherKey: 'student_id',
});

Student.belongsToMany(Lesson, {
    through: LessonStudent,
    foreignKey: 'student_id',
    otherKey: 'lesson_id',
});

Lesson.belongsToMany(Teacher, {
    through: 'lesson_teachers',
    foreignKey: 'lesson_id',
    otherKey: 'teacher_id',
});

Teacher.belongsToMany(Lesson, {
    through: 'lesson_teachers',
    foreignKey: 'teacher_id',
    otherKey: 'lesson_id',
});
// // Устанавливаем ассоциации
// Lesson.belongsToMany(Student, {
//     through: 'lesson_students',
//     foreignKey: 'lesson_id',
//     otherKey: 'student_id',
// });
//
// Lesson.belongsToMany(Teacher, {
//     through: 'lesson_teachers',
//     foreignKey: 'lesson_id',
//     otherKey: 'teacher_id',
// });
// Экспортируем модели и sequelize
export { Lesson, Teacher, Student, LessonStudent, sequelize };
