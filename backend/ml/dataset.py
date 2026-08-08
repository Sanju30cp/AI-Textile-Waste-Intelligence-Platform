import os
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from sklearn.model_selection import train_test_split

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
        
        image = Image.open(img_path).convert('RGB')
        label = self.dataframe.loc[idx, 'product_type_encoded']
        
        if self.transform:
            image = self.transform(image)
            
        return image, torch.tensor(label, dtype=torch.long)

def get_dataloaders(csv_path, img_dir, batch_size=32, num_workers=4):
    import joblib
    df = pd.read_csv(csv_path)
    
    encoder_path = os.path.join(os.path.dirname(csv_path), "label_encoder.pkl")
    le = joblib.load(encoder_path)
    df['product_type_encoded'] = le.transform(df['product_type'])
    
    # Filter classes for stratification
    class_counts = df['product_type_encoded'].value_counts()
    valid_classes = class_counts[class_counts >= 3].index
    df = df[df['product_type_encoded'].isin(valid_classes)].copy()

    train_df, temp_df = train_test_split(df, test_size=0.2, stratify=df['product_type_encoded'], random_state=42)
    
    temp_class_counts = temp_df['product_type_encoded'].value_counts()
    valid_temp_classes = temp_class_counts[temp_class_counts >= 2].index
    temp_df_filtered = temp_df[temp_df['product_type_encoded'].isin(valid_temp_classes)]
    
    try:
        val_df, test_df = train_test_split(temp_df_filtered, test_size=0.5, stratify=temp_df_filtered['product_type_encoded'], random_state=42)
    except ValueError:
        val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

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
    
    # Check if OS is windows to avoid num_workers > 0 issues sometimes, but let's keep it as is.
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    
    return train_loader, val_loader, test_loader, len(df['product_type_encoded'].unique())
