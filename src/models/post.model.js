// import { MariaDbDialect } from "@sequelize/mariadb";
import { Sequelize, DataTypes } from "@sequelize/core";
import dotenv from "dotenv";
import { PostgresDialect } from "@sequelize/postgres";

dotenv.config();
/* export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  // url: process.env.POSTGRES_URL,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: 5432,
  // ssl: true,
  // clientMinMessages: "notice",
}); */
const sequelize = new Sequelize({
  url: process.env.RAILWAY,
  dialect: PostgresDialect,
  // dialect: "postgres",
  // ssl: true,
});

export const Post = sequelize.define(
  "post",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    summary: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    thumbnail: { type: DataTypes.STRING(500) },
    posted: { type: DataTypes.STRING, defaultValue: "false" }, // change this to boolean
    visits: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export const Categories = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true },
);

export const Tags = sequelize.define(
  "tag",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING(20), allowNull: false },
  },
  { timestamps: false, freezeTableName: true },
);

export const Comment = sequelize.define(
  "comment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    visitor: { type: DataTypes.STRING(50), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  },

  { timestamps: false, freezeTableName: true },
);

// One-to-Many relationship
Post.hasMany(Comment, {
  foreignKey: {
    name: "postID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false,
  },
});
Comment.belongsTo(Post, {
  foreignKey: {
    name: "postID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false,
  },
});

// Many-to-Many relationship
Post.belongsToMany(Categories, { through: "join_catPost" });
Categories.belongsToMany(Post, { through: "join_catPost" });

// Many-to-Many relationship
Post.belongsToMany(Tags, { through: "join_tagPost" });
Tags.belongsToMany(Post, { through: "join_tagPost" });

// Creating tables into the database
(async () => {
  try {
    sequelize.authenticate();
    sequelize.sync();
  } catch (error) {
    console.log(error.message);
  }
})();
