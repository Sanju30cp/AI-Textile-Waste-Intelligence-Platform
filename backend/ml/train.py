import os
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
import matplotlib.pyplot as plt
from dataset import get_dataloaders

def train_model():
    base_dir = r"C:\Users\Sanju b\OneDrive\Desktop\Infosys Project\backend\ml"
    csv_path = os.path.join(base_dir, "dataset", "cleaned_labels.csv")
    img_dir = os.path.join(base_dir, "dataset", "selected_images")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    model_save_path = os.path.join(models_dir, "product_classifier.pth")
    
    # 1. Load Data
    print("Loading data...")
    # num_workers=0 to avoid multiprocessing issues on Windows
    train_loader, val_loader, test_loader, num_classes = get_dataloaders(csv_path, img_dir, batch_size=32, num_workers=0)
    print(f"Number of classes: {num_classes}")
    
    # 2. Setup Model (EfficientNet-B0)
    print("Initializing EfficientNet-B0...")
    # Using torchvision's efficientnet_b0
    model = models.efficientnet_b0(weights='DEFAULT')
    
    # Freeze the base model layers
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace final layer (this will have requires_grad=True by default)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    model = model.to(device)
    
    # 3. Setup Optimizer and Loss
    criterion = nn.CrossEntropyLoss()
    # Only optimize the classifier parameters with a slightly higher learning rate
    optimizer = optim.AdamW(model.classifier.parameters(), lr=0.001)
    
    # 4. Training Loop
    epochs = 5
    best_val_acc = 0.0
    
    history = {
        'train_loss': [], 'val_loss': [],
        'train_acc': [], 'val_acc': []
    }
    
    print("Starting training...")
    for epoch in range(epochs):
        print(f"\nEpoch {epoch+1}/{epochs}")
        print("-" * 10)
        
        start_time = time.time()
        
        # Training phase
        model.train()
        running_loss = 0.0
        running_corrects = 0
        total = 0
        
        for inputs, labels in train_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            loss.backward()
            optimizer.step()
            
            _, preds = torch.max(outputs, 1)
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()
            total += inputs.size(0)
            
        epoch_train_loss = running_loss / total
        epoch_train_acc = running_corrects / total
        
        # Validation phase
        model.eval()
        val_running_loss = 0.0
        val_running_corrects = 0
        val_total = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)
                
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                _, preds = torch.max(outputs, 1)
                val_running_loss += loss.item() * inputs.size(0)
                val_running_corrects += torch.sum(preds == labels.data).item()
                val_total += inputs.size(0)
                
        epoch_val_loss = val_running_loss / val_total
        epoch_val_acc = val_running_corrects / val_total
        
        history['train_loss'].append(epoch_train_loss)
        history['val_loss'].append(epoch_val_loss)
        history['train_acc'].append(epoch_train_acc)
        history['val_acc'].append(epoch_val_acc)
        
        time_elapsed = time.time() - start_time
        print(f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f}")
        print(f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")
        print(f"Time: {time_elapsed:.0f}s")
        
        # Save best model
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), model_save_path)
            print(f"Saved new best model with Val Acc: {best_val_acc:.4f}")

    print(f"\nTraining complete. Best Validation Accuracy: {best_val_acc:.4f}")
    
    # 5. Plot and save graphs
    plt.figure(figsize=(10,5))
    plt.plot(history['train_loss'], label='Train Loss')
    plt.plot(history['val_loss'], label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig(os.path.join(base_dir, "loss_plot.png"))
    plt.close()
    
    plt.figure(figsize=(10,5))
    plt.plot(history['train_acc'], label='Train Accuracy')
    plt.plot(history['val_acc'], label='Validation Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.savefig(os.path.join(base_dir, "accuracy_plot.png"))
    plt.close()
    print(f"Saved loss and accuracy plots to {base_dir}")

if __name__ == '__main__':
    train_model()
