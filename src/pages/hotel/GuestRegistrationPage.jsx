// src/pages/GuestRegistrationPage.jsx
import PageHeader from '../../components/ui/PageHeader';
import GuestRegistrationForm from '../../features/guest/GuestRegistrationForm';

const GuestRegistrationPage = () => {
  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        title="New Guest Registration"
        description="A guided notebook flow for identity, stay details, verification, companions, and review."
      />
      <GuestRegistrationForm />
    </div>
  );
};

export default GuestRegistrationPage;
