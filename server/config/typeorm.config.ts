import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') ?? 'postgres',
  port: configService.get('DB_PORT') ?? 5432,
  username: configService.get('DB_USERNAME') ?? 'postgres',
  password: configService.get('DB_PASSWORD') ?? 'postgres',
  database: configService.get('DB_DATABASE') ?? 'fitness_platform_db',
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
});
