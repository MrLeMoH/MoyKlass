import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { Teacher } from './Teacher.js';
import { Student } from './Student.js';

export class Lesson extends Model {
    public id!: number;
    public date!: Date;
    public title!: string;
    public status!: number;

    // Определение ассоциаций
    public students?: Student[]; // Студенты, записанные на занятие
    public teachers?: Teacher[]; // Учителя, ведущие занятие

    public static associations: {
        students: Association<Lesson, Student>;
        teachers: Association<Lesson, Teacher>;
    };
}

Lesson.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // По умолчанию статус "не проведено"
        },
    },
    {
        sequelize,
        modelName: 'Lesson',
        tableName: 'lessons',
        timestamps: false,
    }
);



