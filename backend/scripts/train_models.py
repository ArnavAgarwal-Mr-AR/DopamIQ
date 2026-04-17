from app.prediction.trainer import Trainer


def main():
    trainer = Trainer()

    # Dummy training data (replace later with real dataset)
    X = [[0.1], [0.5], [0.9], [0.3]]
    y = [0, 1, 1, 0]

    model = trainer.train_dummy(X, y)

    trainer.save_model(model, "baseline_model")

    print("Model trained and saved successfully.")


if __name__ == "__main__":
    main()