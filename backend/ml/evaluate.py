import os
import torch
import torch.nn as nn
from torchvision import models
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

from dataset import get_dataloaders

def evaluate_model():
    base_dir = r"C:\Users\Sanju b\OneDrive\Desktop\Infosys Project\backend\ml"
    csv_path = os.path.join(base_dir, "dataset", "cleaned_labels.csv")
    img_dir = os.path.join(base_dir, "dataset", "selected_images")
    model_path = os.path.join(base_dir, "models", "product_classifier.pth")
    encoder_path = os.path.join(base_dir, "dataset", "label_encoder.pkl")
    
    print("Loading data...")
    _, _, test_loader, num_classes = get_dataloaders(csv_path, img_dir, batch_size=32, num_workers=0)
    
    print("Loading LabelEncoder...")
    le = joblib.load(encoder_path)
    class_names = le.classes_
    
    print("Initializing model...")
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}. Please train the model first.")
        return
        
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    
    all_preds = []
    all_labels = []
    
    print("Evaluating on test set...")
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
    # Calculate metrics
    acc = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds, average='weighted', zero_division=0)
    recall = recall_score(all_labels, all_preds, average='weighted', zero_division=0)
    f1 = f1_score(all_labels, all_preds, average='weighted', zero_division=0)
    
    print("\n" + "="*30)
    print("Evaluation Results:")
    print("="*30)
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("="*30)
    
    print("\nClassification Report:")
    unique_labels = sorted(list(set(all_labels) | set(all_preds)))
    target_names = [class_names[i] for i in unique_labels]
    
    print(classification_report(all_labels, all_preds, target_names=target_names, zero_division=0))
    
    # Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds)
    
    plt.figure(figsize=(12,10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=target_names, yticklabels=target_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(base_dir, "confusion_matrix.png"))
    plt.close()
    
    print(f"Saved confusion matrix plot to {base_dir}")

if __name__ == '__main__':
    evaluate_model()
