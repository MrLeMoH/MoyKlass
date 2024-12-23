import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js';

export class Teacher extends Model {
    public id!: number;
    public name!: string;
}

Teacher.init(
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
        modelName: 'Teacher',
        tableName: 'teachers',
        timestamps: false,
    }
);
