import { Migration } from '@mikro-orm/migrations';

export class Migration20220604015651 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bost" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');

    this.addSql('drop table if exists "post" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');

    this.addSql('drop table if exists "bost" cascade;');
  }

}
