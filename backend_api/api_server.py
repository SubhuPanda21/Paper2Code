"""
Flask API Backend for Paper2Code
Connects the Paper2Code backend with Streamlit/React frontends
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
from pathlib import Path
import tempfile
import shutil
import json
from werkzeug.utils import secure_filename

# Add Paper2Code to path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from paper2code.pipeline import Paper2CodePipeline
    from paper2code.config.config import Paper2CodeConfig
    PAPER2CODE_AVAILABLE = True
except ImportError:
    PAPER2CODE_AVAILABLE = False
    print("Warning: Paper2Code not available. Install it first.")

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'pdf'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max file size


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'paper2code_available': PAPER2CODE_AVAILABLE
    })


@app.route('/api/process', methods=['POST'])
def process_paper():
    """
    Process uploaded research paper
    
    Expected form data:
    - file: PDF file
    - framework: 'pytorch' or 'tensorflow'
    - includeLogging: boolean
    - includeCheckpointing: boolean
    """
    
    if not PAPER2CODE_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'Paper2Code backend not available. Please install the package.'
        }), 500
    
    # Check if file is present
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file uploaded'
        }), 400
    
    file = request.files['file']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Only PDF files are allowed'
        }), 400
    
    try:
        # Get configuration from request
        framework = request.form.get('framework', 'pytorch').lower()
        include_logging = request.form.get('includeLogging', 'true').lower() == 'true'
        include_checkpointing = request.form.get('includeCheckpointing', 'true').lower() == 'true'
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(upload_path)
        
        # Create output directory
        output_name = Path(filename).stem
        output_dir = os.path.join(OUTPUT_FOLDER, output_name)
        os.makedirs(output_dir, exist_ok=True)
        
        # Configure Paper2Code
        config = Paper2CodeConfig()
        config.generator.framework = framework
        config.generator.include_logging = include_logging
        config.generator.include_checkpointing = include_checkpointing
        
        # Initialize pipeline
        pipeline = Paper2CodePipeline(config=config)
        
        # Process the paper
        result = pipeline.process_paper(
            pdf_path=upload_path,
            output_dir=output_dir
        )
        
        if result['success']:
            # Read generated code
            with open(result['training_script'], 'r') as f:
                generated_code = f.read()
            
            # Read metadata
            with open(result['metadata'], 'r') as f:
                metadata = json.load(f)
            
            # Extract components
            components = result.get('components', {})
            arch = components.get('architecture', {})
            hparams = components.get('hyperparameters', {})
            
            # Return success response
            return jsonify({
                'success': True,
                'paper_title': result.get('paper_title', 'Unknown'),
                'architecture': arch.get('name', 'Unknown'),
                'architecture_type': arch.get('type', 'Unknown'),
                'learning_rate': hparams.get('learning_rate'),
                'batch_size': hparams.get('batch_size'),
                'epochs': hparams.get('epochs'),
                'optimizer': hparams.get('optimizer'),
                'loss_function': hparams.get('loss_function'),
                'dataset': components.get('dataset'),
                'metrics': components.get('metrics', []),
                'code': generated_code,
                'output_dir': output_dir,
                'files': {
                    'training_script': result['training_script'],
                    'metadata': result['metadata'],
                    'readme': result.get('readme')
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Unknown error occurred')
            }), 500
            
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500
    finally:
        # Cleanup uploaded file
        if os.path.exists(upload_path):
            os.remove(upload_path)


@app.route('/api/download/<path:filename>', methods=['GET'])
def download_file(filename):
    """Download generated files"""
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    
    if not os.path.exists(file_path):
        return jsonify({
            'success': False,
            'error': 'File not found'
        }), 404
    
    return send_file(file_path, as_attachment=True)


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get processing statistics"""
    # Count processed papers
    output_dirs = [d for d in os.listdir(OUTPUT_FOLDER) 
                   if os.path.isdir(os.path.join(OUTPUT_FOLDER, d))]
    
    return jsonify({
        'papers_processed': len(output_dirs),
        'success_rate': 0.95,  # You can track this in a database
        'avg_processing_time': 10.3,
        'accuracy': 0.88
    })


if __name__ == '__main__':
    print("=" * 70)
    print("Paper2Code API Backend")
    print("=" * 70)
    print(f"\nPaper2Code available: {PAPER2CODE_AVAILABLE}")
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Output folder: {OUTPUT_FOLDER}")
    print("\nStarting server on http://localhost:5000")
    print("API Endpoints:")
    print("  GET  /api/health        - Health check")
    print("  POST /api/process       - Process paper")
    print("  GET  /api/download/<f>  - Download file")
    print("  GET  /api/stats         - Get statistics")
    print("=" * 70)
    print("\nPress Ctrl+C to stop\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
