import { envConfig } from '@helper/env.helpers';
import { Sequelize } from 'sequelize-typescript';
import { Brand } from '@modules/brands/entities/brand.entity';
import { Product } from '@modules/products/entities/product.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: envConfig.DB_HOST,
        port: parseInt(envConfig.DB_PORT),
        username: envConfig.DB_USERNAME,
        password: envConfig.DB_PASSWORD,
        database: envConfig.DB_NAME,
      });
      sequelize.addModels([Brand, Product]);
      await sequelize.sync({ force: false });
      return sequelize;
    },
  },
];
