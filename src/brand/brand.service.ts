import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BrandService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBrand(brand_name: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO brand (brand_name) VALUES (?)',
      [brand_name],
    );
    return { brand_id: result.insertId, brand_name: brand_name };
  }

  async findByBrand(brand_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT brand_id, brand_name FROM brand WHERE brand_name = ?',
      [brand_name],
    );
    return rows[0];
  }

  async findById(brand_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT brand_id, brand_name FROM brand WHERE brand_id = ?',
      [brand_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT brand_id, brand_name FROM brand',
    );
    return rows;
  }

  async updateBrand(brand_id: number, partial: { brand_name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.brand_name) {
      fields.push('brand_name = ?');
      values.push(partial.brand_name);
    }

    if (fields.length === 0) return await this.findById(brand_id);

    values.push(brand_id);

    const sql = `UPDATE brand SET ${fields.join(', ')} WHERE brand_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(brand_id);
  }

  async deleteBrand(brand_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM brand WHERE brand_id = ?',
      [brand_id],
    );
    return result.affectedRows > 0;
  }
}
