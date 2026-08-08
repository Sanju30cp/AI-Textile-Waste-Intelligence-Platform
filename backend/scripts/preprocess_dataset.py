import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATASET_DIR = BASE_DIR / "datasets" / "deep-fashion-multimodal"
CSV_PATH = DATASET_DIR / "labels_front.csv"
IMAGES_DIR = DATASET_DIR / "selected_images"
OUTPUT_DIR = DATASET_DIR / "processed"

def main():
    print("Starting dataset preprocessing...")
    
    # 1. Read labels_front.csv
    if not CSV_PATH.exists():
        print(f"Error: Could not find labels CSV at {CSV_PATH}")
        return
        
    df = pd.read_csv(CSV_PATH)
    print(f"Loaded {len(df)} initial records.")
    
    # 2. Keep only needed columns: image_id, path, product_type
    # We keep image_id for reference and path for loading the image
    df = df[['image_id', 'path', 'product_type']]
    
    # 3. Match each row with its image in selected_images and filter missing
    def image_exists(path_str):
        return (IMAGES_DIR / path_str).exists()
        
    df['exists'] = df['path'].apply(image_exists)
    df = df[df['exists']]
    df = df.drop(columns=['exists'])
    
    print(f"Records after checking image existence: {len(df)}")
    
    # 4. Filter out any rows with missing product_type
    df = df.dropna(subset=['product_type'])
    print(f"Records after dropping missing labels: {len(df)}")
    
    # 5. Label Encoding
    encoder = LabelEncoder()
    df['product_type_encoded'] = encoder.fit_transform(df['product_type'])
    print(f"Found {len(encoder.classes_)} unique product types.")
    
    # 6. Split data (80% Train, 10% Val, 10% Test)
    # First split: 80% train, 20% temp
    train_df, temp_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['product_type_encoded'])
    
    # Second split: 10% val, 10% test (which is 50% of the 20% temp)
    val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42, stratify=temp_df['product_type_encoded'])
    
    print(f"Train split: {len(train_df)}")
    print(f"Validation split: {len(val_df)}")
    print(f"Test split: {len(test_df)}")
    
    # 7. Save outputs
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    train_df.to_csv(OUTPUT_DIR / "train.csv", index=False)
    val_df.to_csv(OUTPUT_DIR / "val.csv", index=False)
    test_df.to_csv(OUTPUT_DIR / "test.csv", index=False)
    
    # Save the label encoder
    encoder_path = OUTPUT_DIR / "label_encoder.pkl"
    joblib.dump(encoder, encoder_path)
    print(f"Saved split CSVs and label encoder to {OUTPUT_DIR}")
    
    print("Preprocessing completed successfully!")

if __name__ == "__main__":
    main()
