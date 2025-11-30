/**
 * Insurance Controller
 * API endpoints for travel insurance
 */

import { Request, Response } from 'express';
import { Insurance } from '../models/Insurance.js';

/**
 * Get all active insurance plans
 * GET /api/insurance/plans
 */
export const getInsurancePlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Insurance.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .select('-termsAndConditions -claimProcess -__v');

    res.status(200).json({
      success: true,
      message: 'Insurance plans retrieved successfully',
      data: plans,
      count: plans.length
    });
  } catch (error: any) {
    console.error('[InsuranceController] getInsurancePlans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve insurance plans',
      error: error.message
    });
  }
};

/**
 * Get single insurance plan by ID or slug
 * GET /api/insurance/plans/:id
 */
export const getInsurancePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let plan = await Insurance.findById(id).catch(() => null);
    
    if (!plan) {
      plan = await Insurance.findOne({ slug: id, isActive: true });
    }

    if (!plan) {
      res.status(404).json({
        success: false,
        message: 'Insurance plan not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Insurance plan retrieved successfully',
      data: plan
    });
  } catch (error: any) {
    console.error('[InsuranceController] getInsurancePlan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve insurance plan',
      error: error.message
    });
  }
};

/**
 * Calculate insurance premium
 * POST /api/insurance/calculate
 */
export const calculatePremium = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId, bookingAmount, passengerCount = 1 } = req.body;

    if (!planId) {
      res.status(400).json({
        success: false,
        message: 'Plan ID is required'
      });
      return;
    }

    const plan = await Insurance.findById(planId);
    
    if (!plan || !plan.isActive) {
      res.status(404).json({
        success: false,
        message: 'Insurance plan not found or inactive'
      });
      return;
    }

    let premium: number;

    if (plan.priceType === 'percentage' && plan.percentageOfBooking && bookingAmount) {
      // Calculate percentage-based premium
      premium = Math.round((bookingAmount * plan.percentageOfBooking) / 100);
      
      // Apply limits
      if (plan.minPrice && premium < plan.minPrice) {
        premium = plan.minPrice;
      }
      if (plan.maxPrice && premium > plan.maxPrice) {
        premium = plan.maxPrice;
      }
    } else {
      // Fixed price
      premium = plan.price;
    }

    // Multiply by passenger count
    const totalPremium = premium * passengerCount;

    res.status(200).json({
      success: true,
      message: 'Premium calculated successfully',
      data: {
        planId: plan._id,
        planName: plan.name,
        pricePerPerson: premium,
        passengerCount,
        totalPremium,
        maxCoverage: plan.maxCoverageAmount,
        coverageItems: plan.coverage.filter(c => c.isIncluded).length
      }
    });
  } catch (error: any) {
    console.error('[InsuranceController] calculatePremium error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate premium',
      error: error.message
    });
  }
};

/**
 * Compare insurance plans
 * GET /api/insurance/compare
 */
export const comparePlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planIds } = req.query;

    let plans;
    
    if (planIds && typeof planIds === 'string') {
      const ids = planIds.split(',');
      plans = await Insurance.find({ 
        _id: { $in: ids },
        isActive: true 
      }).sort({ displayOrder: 1 });
    } else {
      // Return all active plans for comparison
      plans = await Insurance.find({ isActive: true })
        .sort({ displayOrder: 1 })
        .limit(5);
    }

    // Build comparison matrix
    const coverageTypes = [
      'trip_cancellation',
      'medical_emergency',
      'baggage_loss',
      'flight_delay',
      'trip_interruption',
      'personal_accident',
      'emergency_evacuation'
    ];

    const comparisonData = plans.map(plan => {
      const coverageMap: Record<string, { included: boolean; maxAmount: number }> = {};
      
      coverageTypes.forEach(type => {
        const coverage = plan.coverage.find(c => c.type === type);
        coverageMap[type] = {
          included: coverage?.isIncluded || false,
          maxAmount: coverage?.maxAmount || 0
        };
      });

      return {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        planType: plan.planType,
        maxCoverage: plan.maxCoverageAmount,
        deductible: plan.deductible,
        isPopular: plan.isPopular,
        coverageDetails: coverageMap,
        features: plan.features
      };
    });

    res.status(200).json({
      success: true,
      message: 'Plan comparison generated',
      data: {
        plans: comparisonData,
        coverageTypes: coverageTypes.map(type => ({
          key: type,
          label: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }))
      }
    });
  } catch (error: any) {
    console.error('[InsuranceController] comparePlans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare plans',
      error: error.message
    });
  }
};

// Admin endpoints

/**
 * Create insurance plan (Admin)
 * POST /api/admin/insurance
 */
export const createInsurancePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const planData = req.body;

    // Generate slug if not provided
    if (!planData.slug && planData.name) {
      planData.slug = planData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const plan = new Insurance(planData);
    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Insurance plan created successfully',
      data: plan
    });
  } catch (error: any) {
    console.error('[InsuranceController] createInsurancePlan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create insurance plan',
      error: error.message
    });
  }
};

/**
 * Update insurance plan (Admin)
 * PUT /api/admin/insurance/:id
 */
export const updateInsurancePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = await Insurance.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!plan) {
      res.status(404).json({
        success: false,
        message: 'Insurance plan not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Insurance plan updated successfully',
      data: plan
    });
  } catch (error: any) {
    console.error('[InsuranceController] updateInsurancePlan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update insurance plan',
      error: error.message
    });
  }
};

/**
 * Delete insurance plan (Admin)
 * DELETE /api/admin/insurance/:id
 */
export const deleteInsurancePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete - just mark as inactive
    const plan = await Insurance.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!plan) {
      res.status(404).json({
        success: false,
        message: 'Insurance plan not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Insurance plan deleted successfully'
    });
  } catch (error: any) {
    console.error('[InsuranceController] deleteInsurancePlan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete insurance plan',
      error: error.message
    });
  }
};
