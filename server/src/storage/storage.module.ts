// src/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';

@Module({
  controllers: [StorageController],
})
export class StorageModule {}
