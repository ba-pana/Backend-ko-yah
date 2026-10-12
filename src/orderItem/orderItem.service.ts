import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrderItemService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrderItem(order_id: string, laptop_id: string, quantity = 1) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT laptop_id, price FROM laptop WHERE laptop_id = ?',
      [laptop_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Laptop not found');
    }

    const laptop = rows[0];

    const unit_price = Number(laptop.price);
    const sub_total = unit_price * quantity;

    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orderItem (order_id, laptop_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [order_id, laptop_id, quantity, unit_price, sub_total],
    );

    await this.pool().execute(
      `UPDATE orders SET total_amount = (SELECT SUM (subtotal) FROM orderItem WHERE order_id = ?) WHERE order_id = ?`,
      [order_id, order_id],
    );

    return { order_item_id: result.insertId, order_id, laptop_id, quantity, unit_price, sub_total };
  }



  async findById(orderItem_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id, order_id, laptop_id, quantity, unit_price, subtotal FROM orderItem WHERE order_item_id = ?',
      [orderItem_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id, order_id, laptop_id, quantity, unit_price, subtotal FROM orderItem',
    );
    return rows;
  }

  async updateOrderItem(orderItem_id: number, partial: { order_id?: string; laptop_id?: string; quantity?: number; unit_price?: number; subtotal?: number;  }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.quantity) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }

    if (partial.unit_price) {
      fields.push('unit_price = ?');
      values.push(partial.unit_price);
    }

    if (partial.subtotal) {
      fields.push('subtotal = ?');
      values.push(partial.subtotal);
    }

    if (fields.length === 0) return await this.findById(orderItem_id);

    values.push(orderItem_id);

    const sql = `UPDATE orderItem SET ${fields.join(', ')} WHERE order_item_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(orderItem_id);
  }

  async deleteOrderItem(orderItem_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM orderItem WHERE order_item_id = ?',
      [orderItem_id],
    );
    return result.affectedRows > 0;
  }
}