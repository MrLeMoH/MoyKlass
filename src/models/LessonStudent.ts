import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js';

export class LessonStudent extends Model {}

LessonStudent.init(
    {
        lessonId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'lessons',
                key: 'id',
            },
        },
        studentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'students',
                key: 'id',
            },
        },
        visit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'LessonStudent',
        tableName: 'lesson_students',
        timestamps: false,
    }
);

