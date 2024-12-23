import {Model, DataTypes, Association} from 'sequelize';
import { sequelize } from '../sequelize.js';
import { LessonStudent } from './LessonStudent.js';
import {Lesson} from "./Lesson";
import {Teacher} from "./Teacher";



export class Student extends Model {
    public id!: number;
    public name!: string;

    public lessonStudent?: LessonStudent; // Студенты, записанные на занятие

    public static associations: {
        lessonStudent: Association<Student, LessonStudent>;
    };
}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Student',
        tableName: 'students',
        timestamps: false,
    }
);
