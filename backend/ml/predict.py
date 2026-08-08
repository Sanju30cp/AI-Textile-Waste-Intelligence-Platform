import os
import argparse
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import joblib
import torch.nn.functional as F

def predict_image(image_path, top_k=3):
    base_dir = r"C:\Users\Sanju b\OneDrive\Desktop\Infosys Project\backend\ml"
    model_path = os.path.join(base_dir, "models", "product_classifier.pth")
    encoder_path = os.path.join(base_dir, "dataset", "label_encoder.pkl")
    
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}. Please train the model first.")
        return
        
    if not os.path.exists(image_path):
        print(f"Image not found at {image_path}")
        return

    # print("Loading LabelEncoder...")
    le = joblib.load(encoder_path)
    class_names = le.classes_
    num_classes = len(class_names)
    
    # print("Initializing model...")
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    
    # Preprocess image
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    image = Image.open(image_path).convert('RGB')
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    # print("Running inference...")
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]
        
    top_prob, top_catid = torch.topk(probabilities, top_k)
    
    print("\n" + "="*30)
    print(f"Predictions for {os.path.basename(image_path)}:")
    print("="*30)
    for i in range(top_prob.size(0)):
        class_name = class_names[top_catid[i].item()]
        score = top_prob[i].item() * 100
        print(f"{i+1}. {class_name}: {score:.2f}%")
    print("="*30)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Predict product type for an image.')
    parser.add_argument('image_path', type=str, help='Path to the image file')
    parser.add_argument('--top_k', type=int, default=3, help='Number of top predictions to show')
    
    args = parser.parse_args()
    predict_image(args.image_path, args.top_k)
