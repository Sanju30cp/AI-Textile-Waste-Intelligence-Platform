import os
import pandas as pd
import joblib
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATASET_DIR = BASE_DIR / "backend" / "ml" / "dataset"
IMAGES_DIR = DATASET_DIR / "selected_images"
CSV_PATH = DATASET_DIR / "labels_front.csv"
OUTPUT_DIR = BASE_DIR / "backend" / "ml" / "preprocessing"

def main():
    print("--- Phase 1: Dataset Preprocessing ---")
    
    # Step 1: Read the CSV
    print("\nStep 1: Reading CSV...")
    if not CSV_PATH.exists():
        print(f"Error: {CSV_PATH} not found!")
        return
        
    df = pd.read_csv(CSV_PATH)
    total_records = len(df)
    
    # Keep only needed columns
    df = df[['image_id', 'product_type', 'gender', 'path']]
    
    # Step 2: Validate Images
    print("\nStep 2: Validating Images...")
    def check_image(path):
        return (IMAGES_DIR / path).exists()
        
    df['exists'] = df['path'].apply(check_image)
    valid_df = df[df['exists']].copy()
    missing_images = total_records - len(valid_df)
    
    print(f"Total records: {total_records}")
    print(f"Valid records: {len(valid_df)}")
    print(f"Missing images: {missing_images}")
    
    # Step 3: Clean the Dataset
    print("\nStep 3: Cleaning Dataset...")
    # Check for missing values
    valid_df = valid_df.dropna(subset=['product_type', 'gender', 'path'])
    # Drop duplicates
    valid_df = valid_df.drop_duplicates(subset=['image_id'])
    # Drop existing flag
    valid_df = valid_df.drop(columns=['exists'])
    
    cleaned_csv_path = DATASET_DIR / "cleaned_labels.csv"
    valid_df.to_csv(cleaned_csv_path, index=False)
    print(f"Cleaned dataset saved to: {cleaned_csv_path}")
    
    # Step 4: Explore the Dataset (EDA)
    print("\nStep 4: Exploratory Data Analysis (EDA)...")
    print(f"Total Images: {len(valid_df)}")
    
    product_counts = valid_df['product_type'].value_counts()
    print(f"Number of Product Types: {len(product_counts)}")
    print("\nImages per Product Type:")
    print(product_counts.to_string())
    
    # Plot bar chart
    plt.figure(figsize=(10, 6))
    product_counts.plot(kind='bar')
    plt.title('Images per Product Type')
    plt.xlabel('Product Type')
    plt.ylabel('Number of Images')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    chart_path = DATASET_DIR / "product_type_distribution.png"
    plt.savefig(chart_path)
    print(f"\nBar chart saved to {chart_path}")
    
    print("\nGender Distribution:")
    gender_dist = valid_df['gender'].value_counts(normalize=True) * 100
    for gender, pct in gender_dist.items():
        print(f"{gender} : {pct:.1f}%")
        
    # Step 5: Encode Labels
    print("\nStep 5: Encoding Labels...")
    encoder = LabelEncoder()
    valid_df['label'] = encoder.fit_transform(valid_df['product_type'])
    
    for class_name, encoded_label in zip(encoder.classes_, encoder.transform(encoder.classes_)):
        print(f"{class_name} -> {encoded_label}")
        
    encoder_path = OUTPUT_DIR / "label_encoder.pkl"
    joblib.dump(encoder, encoder_path)
    print(f"Label encoder saved to: {encoder_path}")
    
    # Step 6: Train / Validation / Test Split
    print("\nStep 6: Train/Validation/Test Split (80/10/10)...")
    # First split to get 80% train, 20% temp
    train_df, temp_df = train_test_split(
        valid_df, test_size=0.2, random_state=42, stratify=valid_df['label']
    )
    # Second split to get 10% val, 10% test
    val_df, test_df = train_test_split(
        temp_df, test_size=0.5, random_state=42, stratify=temp_df['label']
    )
    
    train_df.to_csv(DATASET_DIR / "train.csv", index=False)
    val_df.to_csv(DATASET_DIR / "val.csv", index=False)
    test_df.to_csv(DATASET_DIR / "test.csv", index=False)
    
    print(f"Training set: {len(train_df)} images")
    print(f"Validation set: {len(val_df)} images")
    print(f"Testing set: {len(test_df)} images")
    
    print("\n✅ Cleaned dataset generated")
    print("✅ Missing images removed")
    print("✅ Labels encoded")
    print("✅ Dataset statistics generated")
    print("✅ Train/Validation/Test split created")

if __name__ == "__main__":
    main()
