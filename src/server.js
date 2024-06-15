import express from "express";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import apiDocumentation from "./documentation/docs.json" assert { type: "json" };
import userRoutes from "./routes/user.router.js";
import postsRoutes from "./routes/post.router.js";
import categoryRoutes from "./routes/category.router.js";
import tagsRoutes from "./routes/tags.router.js";
import uploadHandler from "./firebase/multerConfigs.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(uploadHandler.any());

app.get("/", (req, res) => {
  return res.send("Server is connected!");
});

app.use(
  "/api-docs",
  SwaggerUi.serve,
  SwaggerUi.setup(apiDocumentation, { explorer: true }),
);

app.use("/api/v1/auth/users", userRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
export default app;
