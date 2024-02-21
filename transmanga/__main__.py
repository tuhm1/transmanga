import mediapipe as mp
import cv2
import numpy as np
from manga_ocr import MangaOcr
from PIL import Image
import io
import base64
import translators
import webview
import mimetypes as mime
import json
import pathlib
from transmanga import copilot
from concurrent import futures
import os


def main():
    detector = mp.tasks.vision.ObjectDetector.create_from_options(
        mp.tasks.vision.ObjectDetectorOptions(
            base_options=mp.tasks.BaseOptions(
                model_asset_path=pathlib.Path(__file__, "../detector.tflite"),
            ),
            score_threshold=0.5,
            running_mode=mp.tasks.vision.RunningMode.IMAGE,
        )
    )

    mocr_executor = futures.ThreadPoolExecutor()
    future_mocr = mocr_executor.submit(MangaOcr)

    with futures.ThreadPoolExecutor(
        max_workers=1, initializer=copilot.initialize
    ) as copilot_executor:
        for _ in range(copilot_executor._max_workers):
            copilot_executor.submit(lambda: None)  # to pre-initialize threads

        class Api:
            def detect(self, img_b64: str):
                img_bytes = base64.b64decode(img_b64)
                img_array = np.frombuffer(img_bytes, np.uint8)
                img_cv2 = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                img_cv2 = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
                img_mp = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_cv2)
                return to_dict(detector.detect(img_mp))

            def ocr(self, img_b64: str):
                img_bytes = base64.b64decode(img_b64)
                with Image.open(io.BytesIO(img_bytes)) as img:
                    mocr = future_mocr.result()
                    mocr_executor.shutdown()
                    return mocr(img)

            def translate(self, texts: list[str], language: str):
                joined_texts = "\n".join(texts)
                joined_translations = translators.translate_text(
                    joined_texts, to_language=language, translator="google"
                )
                return joined_translations.split("\n")

            def translate_copilot(self, texts: list[str], language: str):
                return copilot_executor.submit(
                    copilot.translate, texts, language
                ).result()

        # fix https://github.com/python/cpython/issues/88141
        mime.add_type("text/javascript", ".js")

        webview.create_window(
            "Transmanga",
            pathlib.Path(__file__, "../client/dist/index.html").as_posix(),
            js_api=Api(),
            maximized=True,
        )
        webview.start(private_mode=False, debug=os.environ.get("DEBUG") == "1")


def to_dict(obj):
    return json.loads(json.dumps(obj, default=lambda o: getattr(o, "__dict__", str(o))))


if __name__ == "__main__":
    main()
