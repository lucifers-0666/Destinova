/**
 * TensorFlow.js Model Training Script
 * Trains a neural network to predict flight price multipliers
 */

import * as tf from '@tensorflow/tfjs-node';
import { TrainingData, ModelFeatures, TrainingConfig, ModelMetrics } from './types.js';
import { loadTrainingData, generateHistoricalData, exportToJSON } from './generateTrainingData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Feature names in order
const FEATURE_NAMES = [
  'daysUntilDeparture',
  'seatAvailability',
  'dayOfWeek',
  'isWeekend',
  'isHoliday',
  'timeOfDay',
  'seasonalityIndex',
  'routePopularity',
  'demandScore'
];

const NUM_FEATURES = FEATURE_NAMES.length; // 9 inputs

// Default training configuration
const DEFAULT_CONFIG: TrainingConfig = {
  epochs: 100,
  batchSize: 32,
  validationSplit: 0.2,
  learningRate: 0.001,
  shuffle: true,
  verbose: 1
};

/**
 * Prepare tensors from training data
 */
function prepareTensors(data: TrainingData): { 
  xs: tf.Tensor2D; 
  ys: tf.Tensor2D;
  xsArray: number[][];
  ysArray: number[][];
} {
  const xsArray: number[][] = [];
  const ysArray: number[][] = [];
  
  for (const sample of data.samples) {
    // Features in order
    const featureRow = FEATURE_NAMES.map(name => 
      sample.features[name as keyof ModelFeatures]
    );
    xsArray.push(featureRow);
    ysArray.push([sample.priceMultiplier]);
  }
  
  const xs = tf.tensor2d(xsArray, [xsArray.length, NUM_FEATURES]);
  const ys = tf.tensor2d(ysArray, [ysArray.length, 1]);
  
  return { xs, ys, xsArray, ysArray };
}

/**
 * Build the neural network model
 */
function buildModel(learningRate: number = 0.001): tf.Sequential {
  const model = tf.sequential();
  
  // Input layer + Hidden layer 1 (64 neurons)
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [NUM_FEATURES],
    kernelInitializer: 'heNormal',
    name: 'hidden1'
  }));
  
  // Dropout layer (0.2)
  model.add(tf.layers.dropout({
    rate: 0.2,
    name: 'dropout1'
  }));
  
  // Hidden layer 2 (32 neurons)
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    kernelInitializer: 'heNormal',
    name: 'hidden2'
  }));
  
  // Hidden layer 3 (16 neurons)
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
    kernelInitializer: 'heNormal',
    name: 'hidden3'
  }));
  
  // Output layer (1 neuron - price multiplier)
  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear',
    name: 'output'
  }));
  
  // Compile model
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'meanSquaredError',
    metrics: ['mae'] // Mean Absolute Error
  });
  
  return model;
}

/**
 * Train the model
 */
async function trainModel(
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D,
  config: TrainingConfig = DEFAULT_CONFIG
): Promise<tf.History> {
  console.log('\n=== Starting Training ===');
  console.log(`Epochs: ${config.epochs}`);
  console.log(`Batch size: ${config.batchSize}`);
  console.log(`Validation split: ${config.validationSplit}`);
  console.log(`Learning rate: ${config.learningRate}`);
  console.log('');
  
  const history = await model.fit(xs, ys, {
    epochs: config.epochs,
    batchSize: config.batchSize,
    validationSplit: config.validationSplit,
    shuffle: config.shuffle,
    verbose: config.verbose,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if ((epoch + 1) % 10 === 0) {
          console.log(
            `Epoch ${epoch + 1}: loss=${logs?.loss?.toFixed(6)}, ` +
            `mae=${logs?.mae?.toFixed(6)}, ` +
            `val_loss=${logs?.val_loss?.toFixed(6)}, ` +
            `val_mae=${logs?.val_mae?.toFixed(6)}`
          );
        }
      }
    }
  });
  
  return history;
}

/**
 * Evaluate model performance
 */
function evaluateModel(
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D
): ModelMetrics {
  // Get predictions
  const predictions = model.predict(xs) as tf.Tensor;
  const predictedValues = predictions.dataSync();
  const actualValues = ys.dataSync();
  
  // Calculate metrics
  let sumSquaredError = 0;
  let sumAbsoluteError = 0;
  let sumActual = 0;
  let sumActualSquared = 0;
  
  const n = predictedValues.length;
  
  for (let i = 0; i < n; i++) {
    const error = actualValues[i] - predictedValues[i];
    sumSquaredError += error * error;
    sumAbsoluteError += Math.abs(error);
    sumActual += actualValues[i];
    sumActualSquared += actualValues[i] * actualValues[i];
  }
  
  const mse = sumSquaredError / n;
  const mae = sumAbsoluteError / n;
  const rmse = Math.sqrt(mse);
  
  // R-squared score
  const meanActual = sumActual / n;
  const totalVariance = sumActualSquared / n - meanActual * meanActual;
  const r2Score = 1 - (mse / totalVariance);
  
  // Get final training metrics
  const evalResult = model.evaluate(xs, ys) as tf.Tensor[];
  const loss = evalResult[0].dataSync()[0];
  const evalMae = evalResult[1].dataSync()[0];
  
  predictions.dispose();
  evalResult.forEach(t => t.dispose());
  
  return {
    loss,
    mae,
    mse,
    rmse,
    r2Score,
    validationLoss: loss, // Same as loss for final evaluation
    validationMae: evalMae
  };
}

/**
 * Save model to disk
 */
async function saveModel(model: tf.Sequential, modelPath: string): Promise<void> {
  // Create models directory if it doesn't exist
  if (!fs.existsSync(modelPath)) {
    fs.mkdirSync(modelPath, { recursive: true });
  }
  
  // Save model
  const savePath = `file://${modelPath}`;
  await model.save(savePath);
  
  console.log(`\nModel saved to: ${modelPath}`);
  
  // Save model metadata
  const metadata = {
    savedAt: new Date().toISOString(),
    inputShape: [NUM_FEATURES],
    featureNames: FEATURE_NAMES,
    outputShape: [1],
    architecture: 'Sequential: Dense(64,relu) -> Dropout(0.2) -> Dense(32,relu) -> Dense(16,relu) -> Dense(1,linear)'
  };
  
  fs.writeFileSync(
    path.join(modelPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
}

/**
 * Load model from disk
 */
async function loadModel(modelPath: string): Promise<tf.LayersModel | null> {
  const loadPath = `file://${modelPath}/model.json`;
  
  if (!fs.existsSync(path.join(modelPath, 'model.json'))) {
    console.log(`Model not found at: ${modelPath}`);
    return null;
  }
  
  const model = await tf.loadLayersModel(loadPath);
  console.log(`Model loaded from: ${modelPath}`);
  
  return model;
}

/**
 * Make predictions with the trained model
 */
function predict(model: tf.LayersModel | tf.Sequential, features: ModelFeatures): number {
  const featureArray = FEATURE_NAMES.map(name => features[name as keyof ModelFeatures]);
  const inputTensor = tf.tensor2d([featureArray], [1, NUM_FEATURES]);
  
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const result = prediction.dataSync()[0];
  
  inputTensor.dispose();
  prediction.dispose();
  
  return result;
}

/**
 * Main training function
 */
export async function runTraining(
  sampleCount: number = 1000,
  config: TrainingConfig = DEFAULT_CONFIG
): Promise<void> {
  console.log('=== TensorFlow.js Pricing Model Training ===\n');
  console.log(`TensorFlow.js version: ${tf.version.tfjs}`);
  console.log(`Backend: ${tf.getBackend()}`);
  
  // Step 1: Load or generate training data
  console.log('\n--- Step 1: Loading Training Data ---');
  let trainingData = loadTrainingData();
  
  if (!trainingData || trainingData.sampleCount < sampleCount) {
    console.log(`Generating ${sampleCount} training samples...`);
    trainingData = await generateHistoricalData(sampleCount);
    await exportToJSON(trainingData);
  } else {
    console.log(`Loaded ${trainingData.sampleCount} samples from file`);
  }
  
  // Step 2: Prepare tensors
  console.log('\n--- Step 2: Preparing Tensors ---');
  const { xs, ys } = prepareTensors(trainingData);
  console.log(`Input shape: [${xs.shape.join(', ')}]`);
  console.log(`Output shape: [${ys.shape.join(', ')}]`);
  
  // Step 3: Build model
  console.log('\n--- Step 3: Building Neural Network ---');
  const model = buildModel(config.learningRate);
  model.summary();
  
  // Step 4: Train model
  console.log('\n--- Step 4: Training Model ---');
  const history = await trainModel(model, xs, ys, config);
  
  // Step 5: Evaluate model
  console.log('\n--- Step 5: Evaluating Model ---');
  const metrics = evaluateModel(model, xs, ys);
  
  console.log('\n=== Final Model Metrics ===');
  console.log(`Loss (MSE): ${metrics.loss.toFixed(6)}`);
  console.log(`MAE: ${metrics.mae.toFixed(6)}`);
  console.log(`RMSE: ${metrics.rmse.toFixed(6)}`);
  console.log(`R² Score: ${metrics.r2Score.toFixed(6)}`);
  
  // Step 6: Save model
  console.log('\n--- Step 6: Saving Model ---');
  const modelPath = path.join(__dirname, '../../models/pricing-model');
  await saveModel(model, modelPath);
  
  // Save training history
  const historyPath = path.join(modelPath, 'training_history.json');
  fs.writeFileSync(historyPath, JSON.stringify({
    metrics,
    config,
    history: {
      loss: history.history.loss,
      mae: history.history.mae,
      val_loss: history.history.val_loss,
      val_mae: history.history.val_mae
    },
    trainedAt: new Date().toISOString(),
    samplesUsed: trainingData.sampleCount
  }, null, 2));
  
  // Step 7: Test predictions
  console.log('\n--- Step 7: Sample Predictions ---');
  
  const testCases: { name: string; features: ModelFeatures }[] = [
    {
      name: 'Last minute booking (2 days)',
      features: {
        daysUntilDeparture: 0.98, // 2 days
        seatAvailability: 0.3,
        dayOfWeek: 0.67, // Friday
        isWeekend: 1,
        isHoliday: 0,
        timeOfDay: 0.5,
        seasonalityIndex: 0.7,
        routePopularity: 0.8,
        demandScore: 0.75
      }
    },
    {
      name: 'Early bird booking (75 days)',
      features: {
        daysUntilDeparture: 0.17, // 75 days
        seatAvailability: 0.8,
        dayOfWeek: 0.33, // Wednesday
        isWeekend: 0,
        isHoliday: 0,
        timeOfDay: 0.25,
        seasonalityIndex: 0.5,
        routePopularity: 0.6,
        demandScore: 0.4
      }
    },
    {
      name: 'Holiday peak booking',
      features: {
        daysUntilDeparture: 0.67, // 30 days
        seatAvailability: 0.15,
        dayOfWeek: 0.83, // Saturday
        isWeekend: 1,
        isHoliday: 1,
        timeOfDay: 0.75,
        seasonalityIndex: 0.95,
        routePopularity: 0.9,
        demandScore: 0.9
      }
    }
  ];
  
  for (const testCase of testCases) {
    const multiplier = predict(model, testCase.features);
    const basePrice = 5000;
    const predictedPrice = Math.round(basePrice * multiplier);
    console.log(`\n${testCase.name}:`);
    console.log(`  Multiplier: ${multiplier.toFixed(3)}`);
    console.log(`  Base ₹${basePrice} → Predicted ₹${predictedPrice}`);
  }
  
  // Cleanup
  xs.dispose();
  ys.dispose();
  
  console.log('\n=== Training Complete! ===');
  console.log(`Model saved to: ${modelPath}`);
}

// CLI entry point
const args = process.argv.slice(2);
const sampleCount = parseInt(args.find(a => a.startsWith('--samples='))?.split('=')[1] || '1000');
const epochs = parseInt(args.find(a => a.startsWith('--epochs='))?.split('=')[1] || '100');

if (args.includes('--help')) {
  console.log(`
Usage: npm run train:pricing [options]

Options:
  --samples=N    Number of training samples (default: 1000)
  --epochs=N     Number of training epochs (default: 100)
  --help         Show this help message
  `);
  process.exit(0);
}

// Run training
runTraining(sampleCount, { ...DEFAULT_CONFIG, epochs })
  .then(() => {
    console.log('\nTraining script completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nTraining failed:', error);
    process.exit(1);
  });

export { buildModel, loadModel, predict, prepareTensors, evaluateModel };
