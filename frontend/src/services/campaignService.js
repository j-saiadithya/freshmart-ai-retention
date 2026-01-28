import { api } from "./api";

export const getCampaignStatus = async () => {
  const res = await api.get("/status");
  return res.data;
};

export const getCampaignHistory = async () => {
  const res = await api.get("/history");
  return res.data;
};

export const launchRetentionCampaign = async (customerLimit, churnRisk) => {
  const res = await api.post("/sms/retention", null, {
    params: {
      customer_limit: customerLimit,
      churn_risk: churnRisk,
    },
  });
  return res.data;
};

export const testSmsCampaign = async () => {
  const res = await api.get("/sms/test");
  return res.data;
};
