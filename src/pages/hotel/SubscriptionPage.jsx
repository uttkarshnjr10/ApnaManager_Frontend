import { useState } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import { FaCheck, FaMinus, FaSpinner } from 'react-icons/fa';

const MONTHLY_PRICE_ID = 'price_1SSd7yH7KZywp5gQe4FI89Gg';
const YEARLY_PRICE_ID  = 'price_1SSd2rH7KZywp5gQJxJYDQiz';

const plans = [
  {
    key: 'monthly',
    name: 'Monthly Plan',
    price: 'INR 99',
    cadence: '/mo',
    note: 'Billed every month',
    priceId: MONTHLY_PRICE_ID,
    features: [
      { text: 'Guest registration', included: true },
      { text: 'Room management', included: true },
      { text: 'CSV reports', included: true },
      { text: 'Best annual savings', included: false },
    ],
  },
  {
    key: 'yearly',
    name: 'Yearly Plan',
    price: 'INR 999',
    cadence: '/yr',
    note: 'Billed once a year',
    priceId: YEARLY_PRICE_ID,
    highlight: 'Best value',
    features: [
      { text: 'Guest registration', included: true },
      { text: 'Room management', included: true },
      { text: 'CSV reports', included: true },
      { text: 'Best annual savings', included: true },
    ],
  },
];

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (priceId, plan) => {
    setLoading(plan);
    const toastId = toast.loading(`Redirecting to ${plan} checkout...`);

    try {
      const { data } = await apiClient.post('/payments/create-subscription-session', { priceId });
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Could not retrieve checkout URL.');
      }

      toast.dismiss(toastId);
    } catch (err) {
      setLoading(null);
      toast.error(err.message || 'Failed to start subscription.', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Choose the billing rhythm that fits your hotel operations."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-4xl">
        {plans.map((plan) => {
          const isHighlighted = Boolean(plan.highlight);
          const isLoading = loading === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative flex min-h-full flex-col rounded-xl border bg-white p-4 shadow-sm md:p-6 ${
                isHighlighted ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute right-4 top-4">
                  <Badge status="primary">{plan.highlight}</Badge>
                </div>
              )}

              <div className="pr-16">
                <h2 className="text-base font-semibold text-slate-800 md:text-lg">{plan.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{plan.note}</p>
              </div>

              <div className="my-6">
                <p className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {plan.price}<span className="text-sm font-medium text-slate-400">{plan.cadence}</span>
                </p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={`flex items-center gap-3 text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${feature.included ? 'text-blue-600' : 'text-slate-300'}`}>
                      {feature.included ? <FaCheck size={12} /> : <FaMinus size={12} />}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-auto w-full"
                onClick={() => handleSubscribe(plan.priceId, plan.key)}
                disabled={!!loading}
              >
                {isLoading && <FaSpinner className="animate-spin" />}
                {isLoading ? 'Processing...' : `Choose ${plan.key === 'monthly' ? 'Monthly' : 'Yearly'}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPage;
