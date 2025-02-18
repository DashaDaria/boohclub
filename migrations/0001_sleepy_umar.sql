CREATE TABLE "criteria_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"nuance" text,
	CONSTRAINT "criteria_table_category_unique" UNIQUE("category"),
	CONSTRAINT "criteria_table_nuance_unique" UNIQUE("nuance")
);
