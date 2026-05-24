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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
        {plans.map((plan) => {
          const isHighlighted = Boolean(plan.highlight);
          const isLoading = loading === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative flex min-h-full flex-col rounded-2xl border bg-white p-5 md:p-7 transition-all duration-300 hover:shadow-md ${
                isHighlighted
                  ? 'border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute right-4 top-4">
                  <Badge status="primary">{plan.highlight}</Badge>
                </div>
              )}

              <div className="pr-16 text-left">
                <h2 className="text-lg font-bold text-slate-800 md:text-xl">{plan.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{plan.note}</p>
              </div>

              <div className="my-6 text-left border-b border-slate-100 pb-5">
                <p className="text-3xl font-extrabold text-slate-900 md:text-4xl">
                  {plan.price}<span className="text-sm font-medium text-slate-400">{plan.cadence}</span>
                </p>
              </div>

              <ul className="mb-6 space-y-3.5 text-left">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={`flex items-center gap-3 text-sm font-medium ${feature.included ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-200'}`}>
                    <span className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full ${feature.included ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {feature.included ? <FaCheck size={10} /> : <FaMinus size={10} />}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-auto w-full font-bold py-3 transition-all ${isHighlighted ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10' : ''}`}
                onClick={() => handleSubscribe(plan.priceId, plan.key)}
                disabled={!!loading}
              >
                {isLoading && <FaSpinner className="mr-2 animate-spin" />}
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
