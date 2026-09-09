'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * MortgageCalculatorSection Component
 * "How much will it cost?" mortgage calculator
 *
 * Features:
 * - Calculator type tabs
 * - Property price input
 * - Deposit input
 * - Term slider
 * - Interest rate input
 * - Monthly payment display
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Disclaimer text */
  Disclaimer: RichTextField;
  /** Dictionary key: MortgageCalculator_TitlePart1 */
  TitlePart1: TextField;
  /** Dictionary key: MortgageCalculator_TitlePart2 */
  TitlePart2: TextField;
  /** Dictionary key: MortgageCalculator_MortgageTab */
  MortgageTabText: TextField;
  /** Dictionary key: MortgageCalculator_StampDutyTab */
  StampDutyTabText: TextField;
  /** Dictionary key: MortgageCalculator_AffordabilityTab */
  AffordabilityTabText: TextField;
  /** Dictionary key: MortgageCalculator_PropertyPriceLabel */
  PropertyPriceLabel: TextField;
  /** Dictionary key: MortgageCalculator_DepositLabel */
  DepositLabel: TextField;
  /** Dictionary key: MortgageCalculator_TermLabel */
  TermLabel: TextField;
  /** Dictionary key: MortgageCalculator_InterestRateLabel */
  InterestRateLabel: TextField;
  /** Dictionary key: MortgageCalculator_YearsText */
  YearsText: TextField;
  /** Dictionary key: MortgageCalculator_MonthlyPaymentLabel */
  MonthlyPaymentLabel: TextField;
  /** Dictionary key: MortgageCalculator_BasedOnMortgage */
  BasedOnMortgageText: TextField;
  /** Dictionary key: MortgageCalculator_PerWeek */
  PerWeekText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'How much will it cost?' },
  Description: { value: '<p>Use our mortgage calculator to estimate your monthly payments.</p>' },
  Disclaimer: {
    value:
      '<p>This calculator is for illustrative purposes only. Actual rates and payments may vary.</p>',
  },
  TitlePart1: { value: 'How much' },
  TitlePart2: { value: 'will it cost?' },
  MortgageTabText: { value: 'Mortgage Calculator' },
  StampDutyTabText: { value: 'Stamp Duty Calculator' },
  AffordabilityTabText: { value: 'Price a Mortgage' },
  PropertyPriceLabel: { value: 'Property Price' },
  DepositLabel: { value: 'Deposit' },
  TermLabel: { value: 'Term:' },
  InterestRateLabel: { value: 'Interest Rate' },
  YearsText: { value: 'years' },
  MonthlyPaymentLabel: { value: 'Your monthly mortgage payment' },
  BasedOnMortgageText: { value: 'Based on a mortgage of' },
  PerWeekText: { value: 'per week' },
};

export type MortgageCalculatorSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: MortgageCalculatorSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const [calculatorType, setCalculatorType] = useState<'mortgage' | 'sdlt' | 'affordability'>(
    'mortgage'
  );
  const [propertyPrice, setPropertyPrice] = useState('250000');
  const [deposit, setDeposit] = useState('25000');
  const [term, setTerm] = useState(25);
  const [interestRate, setInterestRate] = useState('4.5');

  // Simple mortgage calculation
  const loanAmount = Number(propertyPrice) - Number(deposit);
  const monthlyRate = Number(interestRate) / 100 / 12;
  const numberOfPayments = term * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  return (
    <div className={`component mortgage-calculator-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            <Text field={fields.TitlePart1} />{' '}
          </span>
          <span className="text-[#0072CE]">
            <Text field={fields.TitlePart2} />
          </span>
        </h2>

        {/* Description */}
        <div className="mx-auto mb-8 max-w-2xl text-center text-[#4a4a4a]">
          <RichText field={fields.Description} />
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Calculator Type Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCalculatorType('mortgage')}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                calculatorType === 'mortgage'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              <Text field={fields.MortgageTabText} />
            </button>
            <button
              onClick={() => setCalculatorType('sdlt')}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                calculatorType === 'sdlt'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              <Text field={fields.StampDutyTabText} />
            </button>
            <button
              onClick={() => setCalculatorType('affordability')}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                calculatorType === 'affordability'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              <Text field={fields.AffordabilityTabText} />
            </button>
          </div>

          {/* Calculator Form */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Property Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#003057]">
                  <Text field={fields.PropertyPriceLabel} />
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4a4a4a]">£</span>
                  <input
                    type="text"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full rounded border border-gray-300 py-3 pr-4 pl-8 focus:border-transparent focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
                  />
                </div>
              </div>

              {/* Deposit */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#003057]">
                  <Text field={fields.DepositLabel} />
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4a4a4a]">£</span>
                  <input
                    type="text"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full rounded border border-gray-300 py-3 pr-4 pl-8 focus:border-transparent focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
                  />
                </div>
              </div>

              {/* Term */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#003057]">
                  <Text field={fields.TermLabel} />{' '}
                  <span className="font-bold">
                    {term} {fields.YearsText?.value}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#0072CE]"
                />
                <div className="mt-1 flex justify-between text-xs text-[#4a4a4a]">
                  <span>5 years</span>
                  <span>40 years</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#003057]">
                  <Text field={fields.InterestRateLabel} />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full rounded border border-gray-300 py-3 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#4a4a4a]">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6">
              <p className="mb-2 text-sm text-[#4a4a4a]">
                <Text field={fields.MonthlyPaymentLabel} />
              </p>
              <p className="mb-4 text-5xl font-light text-[#0072CE] md:text-6xl">
                £{Math.round(monthlyPayment).toLocaleString()}
              </p>
              <p className="text-sm text-[#4a4a4a]">
                <Text field={fields.BasedOnMortgageText} />{' '}
                <span className="font-semibold">£{loanAmount.toLocaleString()}</span>
              </p>
              <p className="mt-4 text-3xl font-light text-[#0072CE]">
                £{Math.round(monthlyPayment / 4).toLocaleString()}
                <span className="ml-2 text-sm text-[#4a4a4a]">
                  <Text field={fields.PerWeekText} />
                </span>
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs text-[#4a4a4a]">
            <RichText field={fields.Disclaimer} />
          </div>
        </div>
      </div>
    </div>
  );
};
