import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class LaptopService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createLaptop(category_id: string, brand_id: string, model_name: string, processor: string, graphics_card: string, laptop_ram: string, laptop_storage: string, screen_size: string, price: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO laptop (category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price],
    );
    return { laptop_id: result.insertId, category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price };
  }

  async findByModelname(model_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT laptop_id, category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price, created_at, updated_at FROM laptop WHERE model_name = ?',
      [model_name],
    );
    return rows[0];
  }

  async findById(laptop_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT laptop_id, category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price, created_at, updated_at FROM laptop WHERE laptop_id = ?',
      [laptop_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT laptop_id, category_id, brand_id, model_name, processor, graphics_card, laptop_ram, laptop_storage, screen_size, price, created_at, updated_at FROM laptop',
    );
    return rows;
  }

  async updateLaptop(laptop_id: number, partial: { category_id?: string; brand_id?: string; model_name?: string; processor?: string; graphics_card?: string; laptop_ram?: string; laptop_storage?: string; screen_size?: string; price?: number; }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.model_name) {
      fields.push('model_name = ?');
      values.push(partial.model_name);
    }

    if (partial.processor) {
      fields.push('processor = ?');
      values.push(partial.processor);
    }

    if (partial.graphics_card) {
      fields.push('graphics_card = ?');
      values.push(partial.graphics_card);
    }

    if (partial.laptop_ram) {
      fields.push('laptop_ram = ?');
      values.push(partial.laptop_ram);
    }

    if (partial.laptop_storage) {
      fields.push('laptop_storage = ?');
      values.push(partial.laptop_storage);
    }

    if (partial.screen_size) {
      fields.push('screen_size = ?');
      values.push(partial.screen_size);
    }

    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }

    if (fields.length === 0) return await this.findById(laptop_id);

    values.push(laptop_id);

    const sql = `UPDATE laptop SET ${fields.join(', ')} WHERE laptop_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(laptop_id);
  }

  async deleteLaptop(laptop_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM laptop WHERE laptop_id = ?',
      [laptop_id],
    );
    return result.affectedRows > 0;
  }
}