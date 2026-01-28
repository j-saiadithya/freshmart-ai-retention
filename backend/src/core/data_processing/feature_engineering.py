"""
Feature engineering for churn prediction
"""
import pandas as pd
import numpy as np
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class FeatureEngineer:
    @staticmethod
    def calculate_rfm_features(transactions_df: pd.DataFrame, snapshot_date=None) -> pd.DataFrame:
        """
        Calculate RFM (Recency, Frequency, Monetary) features
        
        Args:
            transactions_df: DataFrame with customer transactions
            snapshot_date: Reference date for recency calculation
            
        Returns:
            DataFrame with RFM features for each customer
        """
        try:
            # Ensure date column is datetime
            if not pd.api.types.is_datetime64_any_dtype(transactions_df['date']):
                transactions_df['date'] = pd.to_datetime(transactions_df['date'])
            
            # Set snapshot date to max transaction date + 1 day
            if snapshot_date is None:
                snapshot_date = transactions_df['date'].max() + pd.Timedelta(days=1)
            
            # Calculate RFM
            rfm = transactions_df.groupby('customer_id').agg({
                'date': lambda x: (snapshot_date - x.max()).days,  # Recency
                'transaction_id': 'count',                          # Frequency
                'amount': 'sum'                                     # Monetary
            }).reset_index()
            
            rfm.columns = ['customer_id', 'recency', 'frequency', 'monetary']
            
            logger.info(f"Calculated RFM features for {len(rfm)} customers")
            return rfm
            
        except Exception as e:
            logger.error(f"Error calculating RFM features: {e}")
            raise
    
    @staticmethod
    def create_churn_features(customers_df: pd.DataFrame, rfm_df: pd.DataFrame) -> pd.DataFrame:
        """
        Create features for churn prediction
        
        Args:
            customers_df: Customer demographic data
            rfm_df: RFM features DataFrame
            
        Returns:
            DataFrame with all features for churn prediction
        """
        try:
            # Merge customer data with RFM features
            features_df = pd.merge(rfm_df, customers_df, on='customer_id', how='left')
            
            # Add derived features
            features_df['avg_transaction_value'] = features_df['monetary'] / features_df['frequency']
            features_df['frequency_per_month'] = features_df['frequency'] / 24  # Assuming 24 months
            
            # Handle missing values
            features_df = features_df.fillna({
                'avg_transaction_value': 0,
                'frequency_per_month': 0
            })
            
            # Log feature creation
            logger.info(f"Created churn features for {len(features_df)} customers")
            logger.info(f"Features: {list(features_df.columns)}")
            
            return features_df
            
        except Exception as e:
            logger.error(f"Error creating churn features: {e}")
            raise
    
    @staticmethod
    def predict_churn_risk(features_df: pd.DataFrame, churn_thresholds: Tuple[float, float] = (0.3, 0.7)) -> pd.DataFrame:
        """
        Predict churn risk based on features
        
        Args:
            features_df: DataFrame with churn features
            churn_thresholds: Thresholds for Low/Medium/High risk
            
        Returns:
            DataFrame with churn risk predictions
        """
        try:
            # Simple rule-based prediction for demo
            # In production, use trained ML model
            
            # Calculate risk score based on recency and frequency
            features_df['risk_score'] = (
                features_df['recency'] / 100 +  # More days = higher risk
                (1 - features_df['frequency'] / features_df['frequency'].max())  # Less frequent = higher risk
            )
            
            # Normalize to 0-1
            features_df['risk_score'] = (features_df['risk_score'] - features_df['risk_score'].min()) / \
                                       (features_df['risk_score'].max() - features_df['risk_score'].min())
            
            # Assign risk categories
            low_threshold, medium_threshold = churn_thresholds
            conditions = [
                features_df['risk_score'] <= low_threshold,
                features_df['risk_score'] <= medium_threshold,
                features_df['risk_score'] > medium_threshold
            ]
            choices = ['Low', 'Medium', 'High']
            
            features_df['churn_risk'] = np.select(conditions, choices, default='Medium')
            features_df['churn_probability'] = features_df['risk_score']
            
            logger.info(f"Churn risk distribution: {features_df['churn_risk'].value_counts().to_dict()}")
            
            return features_df[['customer_id', 'churn_probability', 'churn_risk', 'recency', 'frequency', 'monetary']]
            
        except Exception as e:
            logger.error(f"Error predicting churn risk: {e}")
            raise