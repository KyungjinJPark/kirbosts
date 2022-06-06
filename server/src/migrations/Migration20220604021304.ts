import { Migration } from '@mikro-orm/migrations';

export class Migration20220604021304 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bost" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
