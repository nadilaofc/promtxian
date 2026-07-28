import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    dest: "uploads/"
});

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai", upload.single("image"), async (req, res) => {

    try {

        const mode = req.body.mode;
        const prompt = req.body.prompt || "";

        if (!req.file) {
            return res.json({
                success: false,
                error: "Gambar tidak ditemukan."
            });
        }

        // ==========================
        // MODE GENERATE PROMPT
        // ==========================

        if (mode === "prompt") {

            const imageBytes = fs.readFileSync(req.file.path);

            const base64 = imageBytes.toString("base64");

            const response = await client.responses.create({

                model: "gpt-4.1",

                input: [

                    {
                        role: "user",
                        content: [

                            {
                                type: "input_text",
                                text:
                                    "Buat prompt AI yang sangat detail untuk menghasilkan gambar seperti foto ini. Gunakan bahasa Inggris."
                            },

                            {
                                type: "input_image",
                                image_url: `data:image/jpeg;base64,${base64}`
                            }

                        ]
                    }

                ]

            });

            fs.unlinkSync(req.file.path);

            return res.json({

                success: true,
                prompt: response.output_text

            });

        }

        // ==========================
        // MODE EDIT FOTO
        // ==========================

        if (mode === "edit") {

            fs.unlinkSync(req.file.path);

            return res.json({

                success: true,

                image:
                    "https://placehold.co/1024x1024/png?text=Hasil+AI"

            });

        }

        return res.json({

            success: false,

            error: "Mode tidak dikenali."

        });

    } catch (err) {

        console.log(err);

        res.json({

            success: false,

            error: err.message

        });

    }

});

app.listen(3000, () => {

    console.log("Server berjalan di http://localhost:3000");

});