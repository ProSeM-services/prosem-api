import { Table, Column, Model, BeforeCreate } from 'sequelize-typescript';
import * as crypto from 'crypto';
@Table
export class Company extends Model<Company> {
  @Column
  name: string;

  @Column({unique:true})
  email: string;

  @Column
  address: string;

  @Column
  image: string;
  @Column
  tenantId: string;

  @BeforeCreate
  static generateTenantId(instance:Company){
    if(instance.name){
      const randomString = crypto.randomBytes(10).toString('hex');
      instance.tenantId = `${instance.name}-${randomString}`;
    }
  }
}

