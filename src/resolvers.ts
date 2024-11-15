import { getRepository } from 'typeorm';
import { Employee } from './entity/Employee';

export const resolvers = {
  Query: {
    listEmployees: async (_, { filter, page = 1, limit = 10, sortBy = 'id', order = 'ASC' }, context) => {
      if (!context.user || context.user.role !== 'admin') throw new Error('Access Denied');

      const query = getRepository(Employee).createQueryBuilder('employee');

      if (filter?.name) query.andWhere('employee.name LIKE :name', { name: `%${filter.name}%` });
      if (filter?.age) query.andWhere('employee.age = :age', { age: filter.age });
      if (filter?.class) query.andWhere('employee.class = :class', { class: filter.class });

      return await query
        .orderBy(`employee.${sortBy}`, order)
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    },

    getEmployee: async (_, { id }, context) => {
      if (!context.user || !['admin', 'employee'].includes(context.user.role)) throw new Error('Access Denied');
      return await getRepository(Employee).findOne({ id });
    }
  },

  Mutation: {
    addEmployee: async (_, { name, age, class: empClass, subjects, attendance }, context) => {
      if (context.user.role !== 'admin') throw new Error('Access Denied');
      const employee = getRepository(Employee).create({ name, age, class: empClass, subjects, attendance });
      return await getRepository(Employee).save(employee);
    },

    updateEmployee: async (_, { id, ...args }, context) => {
      if (context.user.role !== 'admin') throw new Error('Access Denied');
      await getRepository(Employee).update(id, args);
      return await getRepository(Employee).findOne({ id });
    }
  }
};