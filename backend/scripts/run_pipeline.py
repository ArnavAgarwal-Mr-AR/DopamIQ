import argparse
from app.services.pipeline_service import run_and_store_pipeline


def main():
    parser = argparse.ArgumentParser(description="Run full pipeline on input file")
    parser.add_argument("--file", type=str, required=True, help="Path to input CSV")
    parser.add_argument("--user_id", type=str, required=True, help="User ID")

    args = parser.parse_args()

    result = run_and_store_pipeline(args.file, args.user_id)

    print("\n=== PIPELINE RESULT ===")
    print(result)


if __name__ == "__main__":
    main()