# Paper2Code - Jupyter Notebook Edition

## 🚀 Quick Start

This package contains a complete Jupyter Notebook implementation of the Paper2Code system!

### What's Included

- **Paper2Code_Demo.ipynb** - Complete working notebook with all code
- **README.md** - This file
- **requirements.txt** - All dependencies

### Installation & Setup

1. **Extract the ZIP file**
   ```bash
   unzip paper2code_notebook.zip
   cd paper2code_notebook
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Launch Jupyter Notebook**
   ```bash
   jupyter notebook
   ```

4. **Open Paper2Code_Demo.ipynb**
   - Click on `Paper2Code_Demo.ipynb` in the Jupyter interface
   - Run all cells sequentially

### What the Notebook Does

The notebook demonstrates a complete end-to-end system:

1. **PDF Parsing** - Extract text from research papers
2. **Information Extraction** - Identify architectures, hyperparameters, datasets
3. **Code Generation** - Create executable PyTorch training scripts
4. **Full Demo** - Working example with sample paper

### Notebook Sections

1. **Setup & Installation** - Install required packages
2. **Import Libraries** - Import all dependencies
3. **Data Structures** - Define core classes
4. **PDF Parser** - Parse research papers
5. **Information Extractor** - Extract ML components
6. **Code Generator** - Generate training scripts
7. **Complete Pipeline** - End-to-end workflow
8. **Demo** - Working example
9. **Extraction Test** - Test on sample text
10. **Save Code** - Export generated script
11. **Usage Guide** - How to use with real papers
12. **Summary** - Project overview

### Usage

#### For Demo (Sample Text)
Just run all cells in order - the notebook includes a sample paper for demonstration!

#### For Real PDF Papers
```python
# In the notebook, add this cell:
pipeline = Paper2CodePipeline()

result = pipeline.process_paper(
    pdf_path="your_paper.pdf",
    output_dir="output"
)

if result['success']:
    print(f"Training script: {result['training_script']}")
```

### Features

✅ **Complete Implementation** - All code in one notebook  
✅ **Interactive Demo** - Run and see results immediately  
✅ **Well Documented** - Markdown explanations for each section  
✅ **Working Example** - Sample paper included  
✅ **Production Ready** - Generates real training code  

### Generated Output

After running, you'll get:
- **train.py** - Complete PyTorch training script
- **metadata.json** - Extracted paper information
- Ready-to-run training code!

### Requirements

- Python 3.8+
- Jupyter Notebook
- PyTorch
- pdfplumber
- PyPDF2
- Other dependencies in requirements.txt

### Supported Features

**Architecture Detection:**
- CNN (Convolutional Neural Networks)
- RNN (Recurrent Neural Networks)
- Transformer
- ResNet
- MLP (Multi-Layer Perceptron)

**Hyperparameter Extraction:**
- Learning rate
- Batch size
- Number of epochs
- Optimizer type
- Loss function

**Dataset Recognition:**
- MNIST
- CIFAR-10/100
- ImageNet
- Custom datasets

### Customization

You can customize the generated code:

1. **Dataset Loading** - Modify `CustomDataset` class
2. **Model Architecture** - Edit model definition
3. **Training Loop** - Adjust training functions
4. **Hyperparameters** - Change config values

### Example Output

The notebook will generate code like:

```python
import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.layers = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool2d(2),
            # ... more layers
        )
    
    def forward(self, x):
        return self.layers(x)

# Complete training loop
def train_epoch(model, train_loader, ...):
    # Training code
    pass

# Main function with extracted hyperparameters
def main():
    config = {
        'learning_rate': 0.001,  # Extracted from paper
        'batch_size': 64,        # Extracted from paper
        'epochs': 100            # Extracted from paper
    }
    # ... rest of training code
```

### Troubleshooting

**Issue: Dependencies not installing**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Issue: Jupyter not found**
```bash
pip install jupyter notebook
```

**Issue: PDF parsing fails**
- Make sure PDF file exists
- Check file path is correct
- Try with a different PDF

### Tips

1. **Start with the demo** - Run all cells to see it work
2. **Read the markdown** - Each section is explained
3. **Customize gradually** - Start simple, then add features
4. **Test with different papers** - Try various research papers

### Project Structure

```
paper2code_notebook/
├── Paper2Code_Demo.ipynb    # Main notebook (complete code)
├── README.md                # This file
├── requirements.txt         # Dependencies
└── generated_output/        # Generated code (created when running)
    ├── train.py
    └── metadata.json
```

### Next Steps

1. ✅ Run the notebook demo
2. ✅ Try with your own PDF paper
3. ✅ Customize the generated code
4. ✅ Train your model!

### Support

For issues or questions:
- Check the notebook markdown explanations
- Review the usage examples
- Consult the generated code comments

### License

MIT License - Free to use and modify!

---

**Made with ❤️ for ML researchers and engineers**

**Ready to transform papers into code? Open the notebook and start!** 🚀
