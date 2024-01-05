import { BaseEntityProsem } from 'src/core/entity/base.entity';
import {  Column, Entity } from 'typeorm';

@Entity()
export class Company extends BaseEntityProsem {
  @Column()
  name: string;

  @Column({unique:true})
  email: string;

  @Column()
  address: string;

  @Column()
  image: string;
}

