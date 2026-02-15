import { Button, Card, Chip } from "@heroui/react";
import { Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { PlanBadge } from "./PlanBadge";
import type { SubscriptionPlan, SubscriptionStatus as Status } from "~/db/schema";

interface SubscriptionStatusProps {
  plan: SubscriptionPlan;
  subscriptionStatus?: Status | null;
  subscriptionExpiresAt?: Date | null;
  onManageBilling?: () => void;
  onCancelSubscription?: () => void;
  isLoading?: boolean;
}

export function SubscriptionStatus({
  plan,
  subscriptionStatus,
  subscriptionExpiresAt,
  onManageBilling,
  onCancelSubscription,
  isLoading = false
}: SubscriptionStatusProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: Status | null | undefined) => {
    if (!status || status === "active") {
      return <Chip size="sm">Active</Chip>;
    }
    
    switch (status) {
      case "canceled":
        return (
          <Chip color="danger" size="sm">
            Canceled
          </Chip>
        );
      case "past_due":
        return (
          <Chip color="danger" size="sm">
            Past Due
          </Chip>
        );
      case "unpaid":
        return (
          <Chip color="danger" size="sm">
            Unpaid
          </Chip>
        );
      case "incomplete":
        return (
          <Chip color="warning" size="sm">
            Incomplete
          </Chip>
        );
      default:
        return (
          <Chip size="sm">
            {status}
          </Chip>
        );
    }
  };

  const getStatusIcon = (status: Status | null | undefined) => {
    if (status === "past_due" || status === "unpaid") {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    return <CreditCard className="h-4 w-4 text-muted-foreground" />;
  };

  const isPaidPlan = plan !== "free";
  const isActive = subscriptionStatus === "active" || plan === "free";
  const needsAttention = subscriptionStatus === "past_due" || subscriptionStatus === "unpaid";

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <Card.Title className="flex items-center gap-2">
              {getStatusIcon(subscriptionStatus)}
              Subscription Status
            </Card.Title>
            <Card.Description>
              Manage your current subscription and billing
            </Card.Description>
          </div>
          <PlanBadge plan={plan} />
        </div>
      </Card.Header>
      
      <Card.Content className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Plan Status</p>
            <p className="text-sm text-muted-foreground">
              {plan === "free" ? "Free plan - No subscription required" : 
               `${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription`}
            </p>
          </div>
          {isPaidPlan && getStatusBadge(subscriptionStatus)}
        </div>

        {subscriptionExpiresAt && isPaidPlan && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {subscriptionStatus === "canceled" ? "Expires" : "Next billing date"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(subscriptionExpiresAt)}
              </p>
            </div>
          </div>
        )}

        {needsAttention && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Payment Issue
                </p>
                <p className="text-sm text-destructive/80">
                  {subscriptionStatus === "past_due" 
                    ? "Your payment is past due. Please update your payment method."
                    : "Your payment failed. Please try again or update your payment method."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {isPaidPlan && isActive && (
          <div className="flex gap-2 pt-2 justify-end">
            <Button 
              onPress={onManageBilling}
              isDisabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Loading..." : "Manage Billing"}
            </Button>
            
            {subscriptionStatus !== "canceled" && (
              <Button 
                onPress={onCancelSubscription}
                isDisabled={isLoading}
                variant="danger"
              >
                {isLoading ? "Loading..." : "Cancel Subscription"}
              </Button>
            )}
          </div>
        )}

        {plan === "free" && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              You're currently on the free plan. Upgrade to unlock more features and increase your limits.
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
