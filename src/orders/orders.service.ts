import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(users_id: string, order_status = "Pending", total_amount = 0.00) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (users_id, order_status, total_amount) VALUES (?, ?, ?)',
      [users_id, order_status, total_amount],
    );
    return { order_id: result.insertId, users_id, order_status, total_amount };
  }

  async findById(order_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, users_id, order_status, total_amount, order_date FROM orders WHERE order_id = ?',
      [order_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, users_id, order_status, total_amount, order_date FROM orders',
    );
    return rows;
  }

  async updateOrder(order_id: number, partial: { users_id?: string; order_status?: string; total_amount?: number; }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_status) {
      fields.push('order_status = ?');
      values.push(partial.order_status);
    }

    if (partial.total_amount !== undefined) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }

    if (fields.length === 0) return await this.findById(order_id);

    values.push(order_id);

    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(order_id);
  }

  async deleteOrder(order_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [order_id],
    );
    return result.affectedRows > 0;
  }
}