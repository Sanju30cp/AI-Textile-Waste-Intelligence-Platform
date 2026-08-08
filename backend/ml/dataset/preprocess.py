import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image

# 8. & 9. Create PyTorch Dataset and DataLoader classes
class DeepFashionDataset(Dataset):
    def __init__(self, dataframe, img_dir, transform=None):
        self.dataframe = dataframe.reset_index(drop=True)
        self.img_dir = img_dir
        self.transform = transform
        
    def __len__(self):
        return len(self.dataframe)
        
    def __getitem__(self, idx):
        img_name = self.dataframe.loc[idx, 'path']
        img_path = os.path.join(self.img_dir, img_name)
        
        # RGB conversion
        image = Image.open(img_path).convert('RGB')
        label = self.dataframe.loc[idx, 'product_type_encoded']
        
        if self.transform:
            image = self.transform(image)
            
        return image, torch.tensor(label, dtype=torch.long)

def get_dataloaders(train_df, val_df, test_df, img_dir, batch_size=32):
    # Preprocessing images: resize, RGB, normalize, data augmentation for training
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = DeepFashionDataset(train_df, img_dir, transform=train_transform)
    val_dataset = DeepFashionDataset(val_df, img_dir, transform=val_test_transform)
    test_dataset = DeepFashionDataset(test_df, img_dir, transform=val_test_transform)
    
    # 9. DataLoader classes
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=4)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=4)
    
    return train_loader, val_loader, test_loader

def main():
    base_dir = r"C:\Users\Sanju b\OneDrive\Desktop\Infosys Project\backend\ml\dataset"
    labels_csv_path = os.path.join(base_dir, "labels_front.csv")
    images_dir = os.path.join(base_dir, "selected_images")
    cleaned_csv_path = os.path.join(base_dir, "cleaned_labels.csv")
    encoder_path = os.path.join(base_dir, "label_encoder.pkl")
    
    # 1. Read labels_front.csv
    df = pd.read_csv(labels_csv_path)
    initial_count = len(df)
    
    # 2. Validate image paths
    def check_exists(path_val):
        return os.path.exists(os.path.join(images_dir, path_val))
    
    df['image_exists'] = df['path'].apply(check_exists)
    missing_count = (~df['image_exists']).sum()
    
    # 3. Remove invalid records
    df = df[df['image_exists']].copy()
    
    # Filter classes with very few samples before splitting to avoid stratification errors
    class_counts = df['product_type'].value_counts()
    valid_classes = class_counts[class_counts >= 3].index
    df = df[df['product_type'].isin(valid_classes)].copy()
    
    # 4. Keep only image_id, product_type, gender, and path
    df = df[['image_id', 'product_type', 'gender', 'path']]
    
    # 5. Create cleaned_labels.csv
    df.to_csv(cleaned_csv_path, index=False)
    
    # 6. Encode product_type labels
    le = LabelEncoder()
    df['product_type_encoded'] = le.fit_transform(df['product_type'])
    
    # 10. Save the label encoder
    joblib.dump(le, encoder_path)
    
    # 7. Perform an 80/10/10 stratified train-validation-test split
    train_df, temp_df = train_test_split(df, test_size=0.2, stratify=df['product_type_encoded'], random_state=42)
    
    # Filter temp_df for classes with at least 2 samples to allow another stratification
    temp_class_counts = temp_df['product_type_encoded'].value_counts()
    valid_temp_classes = temp_class_counts[temp_class_counts >= 2].index
    temp_df_filtered = temp_df[temp_df['product_type_encoded'].isin(valid_temp_classes)]
    
    try:
        val_df, test_df = train_test_split(temp_df_filtered, test_size=0.5, stratify=temp_df_filtered['product_type_encoded'], random_state=42)
    except ValueError:
        # Fallback to non-stratified if it fails
        val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)
    
    # Data summary
    num_classes = len(le.classes_)
    class_dist = df['product_type'].value_counts().to_dict()
    gender_dist = df['gender'].value_counts().to_dict()
    
    summary = f"""# Preprocessing Summary
    
## Dataset Overview
- **Initial records**: {initial_count}
- **Missing images**: {missing_count}
- **Cleaned dataset size**: {len(df)}
- **Train size**: {len(train_df)} (80%)
- **Validation size**: {len(val_df)} (10%)
- **Test size**: {len(test_df)} (10%)

## Class Distribution
- **Number of product_type classes**: {num_classes}
- **Classes**:
"""
    for cls, count in class_dist.items():
        summary += f"  - {cls}: {count}\n"
        
    summary += f"\n## Gender Distribution\n"
    for gen, count in gender_dist.items():
        summary += f"  - {gen}: {count}\n"

    print("---SUMMARY_START---")
    print(summary)
    print("---SUMMARY_END---")
    
if __name__ == '__main__':
    main()
