import { useState } from "react";

const QUESTIONS = [
  // —— 题目部分和之前一样，不需要改动 —— 
  {
    id: "q1",
    text: "How do you usually pay your credit card bill?",
    options: [
      { id: "q1_a", label: "I pay the full balance every month.", tags: [] },
      {
        id: "q1_b",
        label: "I usually pay only the minimum.",
        tags: ["only_min_payment", "interest_cost"],
      },
      {
        id: "q1_c",
        label: "I often pay late or miss payments.",
        tags: ["late_payment", "interest_cost"],
      },
      { id: "q1_d", label: "I don’t have a credit card.", tags: [] },
    ],
  },
  {
    id: "q2",
    text: "Do you track your monthly spending?",
    options: [
      { id: "q2_a", label: "Yes, I use an app or spreadsheet.", tags: [] },
      {
        id: "q2_b",
        label: "Sometimes, but not every month.",
        tags: ["inconsistent_tracking"],
      },
      {
        id: "q2_c",
        label: "No, I rarely know how much I spend.",
        tags: ["no_budget", "inconsistent_tracking"],
      },
    ],
  },
  {
    id: "q3",
    text: "How often do you check your bank or card statements?",
    options: [
      { id: "q3_a", label: "Every week.", tags: [] },
      {
        id: "q3_b",
        label: "Once a month.",
        tags: ["low_financial_awareness"],
      },
      {
        id: "q3_c",
        label: "A few times a year or almost never.",
        tags: ["low_financial_awareness", "missed_fees"],
      },
    ],
  },
  {
    id: "q4",
    text: "Do you have an emergency fund?",
    options: [
      {
        id: "q4_a",
        label: "Yes, at least 1–3 months of basic expenses.",
        tags: [],
      },
      {
        id: "q4_b",
        label: "I have some savings, but less than 1 month.",
        tags: ["weak_emergency_fund"],
      },
      {
        id: "q4_c",
        label: "No, I rely on credit cards or loans for emergencies.",
        tags: ["no_emergency_fund", "high_interest_risk"],
      },
    ],
  },
  {
    id: "q5",
    text: "When you receive extra money (refund, gift, bonus), what do you usually do?",
    options: [
      {
        id: "q5_a",
        label: "I put most of it into savings or paying down debt.",
        tags: [],
      },
      {
        id: "q5_b",
        label: "I split it: some for fun, some for saving/debt.",
        tags: ["impulse_spending_light"],
      },
      {
        id: "q5_c",
        label: "I usually spend it all quickly.",
        tags: ["impulse_spending", "no_saving_priority"],
      },
    ],
  },
  {
    id: "q6",
    text: "How often do you buy things on impulse (not planned)?",
    options: [
      { id: "q6_a", label: "Rarely.", tags: [] },
      {
        id: "q6_b",
        label: "Sometimes, when I’m stressed or bored.",
        tags: ["impulse_spending"],
      },
      {
        id: "q6_c",
        label: "Very often, I decide in the moment.",
        tags: ["impulse_spending", "no_budget"],
      },
    ],
  },
  {
    id: "q7",
    text: "Do you carry a balance on high-interest debt (credit cards, payday loans)?",
    options: [
      {
        id: "q7_a",
        label: "No, I pay them off in full.",
        tags: [],
      },
      {
        id: "q7_b",
        label: "Yes, but I’m slowly paying them down.",
        tags: ["high_interest_debt"],
      },
      {
        id: "q7_c",
        label: "Yes, and I often add new charges.",
        tags: ["high_interest_debt", "debt_cycle"],
      },
    ],
  },
  {
    id: "q8",
    text: "Do you have clear short-term financial goals (next 6–12 months)?",
    options: [
      { id: "q8_a", label: "Yes, and I track my progress.", tags: [] },
      {
        id: "q8_b",
        label: "I have goals in my head, but nothing written.",
        tags: ["no_written_goals"],
      },
      {
        id: "q8_c",
        label: "Not really, I just react month by month.",
        tags: ["no_written_goals", "no_direction"],
      },
    ],
  },
  {
    id: "q9",
    text: "When you overspend in one month, what usually happens next month?",
    options: [
      {
        id: "q9_a",
        label: "I adjust my next month’s budget to correct it.",
        tags: [],
      },
      {
        id: "q9_b",
        label: "I feel bad, but I don’t change much.",
        tags: ["repeat_mistakes"],
      },
      {
        id: "q9_c",
        label: "I avoid looking at numbers and just hope it’s fine.",
        tags: ["repeat_mistakes", "avoid_money_review"],
      },
    ],
  },
  {
    id: "q10",
    text: "How do you decide whether to use credit card vs. debit/cash?",
    options: [
      {
        id: "q10_a",
        label: "I choose based on rewards but still stay within budget.",
        tags: [],
      },
      {
        id: "q10_b",
        label: "I use whichever card is convenient at the moment.",
        tags: ["no_spending_strategy"],
      },
      {
        id: "q10_c",
        label: "I mostly swipe credit without checking my budget.",
        tags: ["no_spending_strategy", "debt_cycle"],
      },
    ],
  },
  {
    id: "q11",
    text: "Do you compare prices or search for discounts before big purchases?",
    options: [
      { id: "q11_a", label: "Yes, almost always.", tags: [] },
      {
        id: "q11_b",
        label: "Sometimes, if I remember.",
        tags: ["missed_savings"],
      },
      {
        id: "q11_c",
        label: "Rarely, I just buy from the first place.",
        tags: ["missed_savings"],
      },
    ],
  },
  {
    id: "q12",
    text: "How often do you update or review your budget?",
    options: [
      { id: "q12_a", label: "Weekly.", tags: [] },
      {
        id: "q12_b",
        label: "Monthly or less often.",
        tags: ["inconsistent_tracking"],
      },
      {
        id: "q12_c",
        label: "I don’t have a budget.",
        tags: ["no_budget", "inconsistent_tracking"],
      },
    ],
  },
  {
    id: "q13",
    text: "Do you pay for subscriptions you rarely use (apps, streaming, gyms)?",
    options: [
      { id: "q13_a", label: "No, I cancel unused ones quickly.", tags: [] },
      {
        id: "q13_b",
        label: "I have 1–2 that I probably should cancel.",
        tags: ["wasted_subscriptions"],
      },
      {
        id: "q13_c",
        label: "I have several I don’t really use.",
        tags: ["wasted_subscriptions"],
      },
    ],
  },
  {
    id: "q14",
    text: "Before taking on new debt (loan, buy now pay later), what do you do?",
    options: [
      {
        id: "q14_a",
        label: "I calculate monthly payments and long-term cost.",
        tags: [],
      },
      {
        id: "q14_b",
        label: "I glance at the monthly payment only.",
        tags: ["underestimate_debt"],
      },
      {
        id: "q14_c",
        label: "I don’t really think, I just sign if I’m approved.",
        tags: ["underestimate_debt", "debt_cycle"],
      },
    ],
  },
  {
    id: "q15",
    text: "How often do you invest for the long term (3+ years)?",
    options: [
      {
        id: "q15_a",
        label: "I have a small but consistent long-term investment plan.",
        tags: [],
      },
      {
        id: "q15_b",
        label: "I invest sometimes when I feel like it.",
        tags: ["no_investing_plan"],
      },
      {
        id: "q15_c",
        label: "I don’t invest at all.",
        tags: ["no_investing_plan"],
      },
    ],
  },
  {
    id: "q16",
    text: "When you feel stressed about money, what do you do?",
    options: [
      {
        id: "q16_a",
        label: "I open my numbers and make a small plan.",
        tags: [],
      },
      {
        id: "q16_b",
        label: "I avoid my bank apps for a while.",
        tags: ["avoid_money_review"],
      },
      {
        id: "q16_c",
        label: "I sometimes spend to feel better (shopping/food).",
        tags: ["impulse_spending", "avoid_money_review"],
      },
    ],
  },
  {
    id: "q17",
    text: "Do you set automatic transfers (for savings, investments, or bill payments)?",
    options: [
      {
        id: "q17_a",
        label: "Yes, I automate at least one or two things.",
        tags: [],
      },
      {
        id: "q17_b",
        label: "I mean to, but I haven’t set them up.",
        tags: ["no_automation"],
      },
      {
        id: "q17_c",
        label: "No, I do everything manually and often forget.",
        tags: ["no_automation", "late_payment"],
      },
    ],
  },
  {
    id: "q18",
    text: "How often do you learn about personal finance (videos, articles, podcasts)?",
    options: [
      { id: "q18_a", label: "Regularly (monthly or more).", tags: [] },
      {
        id: "q18_b",
        label: "Occasionally, when something goes wrong.",
        tags: ["low_financial_education"],
      },
      {
        id: "q18_c",
        label: "Almost never.",
        tags: ["low_financial_education"],
      },
    ],
  },
  {
    id: "q19",
    text: "When you get close to your bank account limit or credit limit, what happens?",
    options: [
      {
        id: "q19_a",
        label: "I slow down spending and adjust my budget.",
        tags: [],
      },
      {
        id: "q19_b",
        label: "I keep spending and hope next month will fix it.",
        tags: ["repeat_mistakes"],
      },
      {
        id: "q19_c",
        label: "I transfer money from another card/loan to cover it.",
        tags: ["debt_cycle"],
      },
    ],
  },
  {
    id: "q20",
    text: "Do you review your financial mistakes from last year and set new habits?",
    options: [
      {
        id: "q20_a",
        label: "Yes, I reflect and set 1–3 clear habits.",
        tags: [],
      },
      {
        id: "q20_b",
        label: "I think about it, but don’t turn it into habits.",
        tags: ["repeat_mistakes"],
      },
      {
        id: "q20_c",
        label: "No, I avoid thinking about past mistakes.",
        tags: ["repeat_mistakes", "avoid_money_review"],
      },
    ],
  },
];

const MISTAKE_DEFINITIONS = {
  // ……这个对象和之前一样，原样保留……
  only_min_payment: {
    title: "Only paying the minimum on credit cards",
    advice:
      "Paying only the minimum keeps you in debt for a long time. Try to pay more than the minimum each month, and use extra money to reduce high-interest balances first.",
  },
  late_payment: {
    title: "Late or missed payments",
    advice:
      "Late payments damage your credit score and add fees. Set up automatic payments for at least the minimum, and add reminders 3–5 days before due dates.",
  },
  interest_cost: {
    title: "High interest cost on revolving balances",
    advice:
      "Revolving a balance on high-interest credit cards is expensive. Focus on paying off the highest-interest debts first while keeping other payments on time.",
  },
  no_budget: {
    title: "No clear budget",
    advice:
      "Without a simple budget, it’s easy to overspend. Start with a basic monthly plan: income, fixed bills, flexible spending, and a small savings target.",
  },
  inconsistent_tracking: {
    title: "Inconsistent tracking of spending",
    advice:
      "If you only track occasionally, patterns are hard to see. Try a weekly 10–15 minute check-in using DebtSetGo’s Budget Tracker or a simple spreadsheet.",
  },
  no_emergency_fund: {
    title: "No emergency fund",
    advice:
      "Emergencies paid with credit cards often lead to long-term debt. Aim to build a small emergency fund first (100–500 USD), then slowly grow it toward 1–3 months of basic expenses.",
  },
  weak_emergency_fund: {
    title: "Emergency fund is very small",
    advice:
      "You started saving (great!), but the buffer is still thin. Add a small, automatic monthly transfer into your emergency savings until you feel more comfortable.",
  },
  high_interest_debt: {
    title: "Carrying high-interest debt",
    advice:
      "High-interest debt (credit cards, payday loans) can trap you. Make a simple payoff plan: list your debts, order them by interest rate, and pay extra on the highest one.",
  },
  debt_cycle: {
    title: "Risk of a repeating debt cycle",
    advice:
      "Using new debt to cover old debt is a warning sign. Pause new non-essential spending and focus on stabilizing: freeze new debt, build a tiny buffer, then attack balances.",
  },
  impulse_spending: {
    title: "Impulse spending",
    advice:
      "Emotional or impulsive spending is common, but it can quietly drain your money. Add a 24-hour rule for purchases above a certain amount and keep a wish list instead of instant buying.",
  },
  no_saving_priority: {
    title: "Treating savings as optional",
    advice:
      "If savings only happen when something is left, they almost never happen. Pay yourself first: even 10–20 USD per month matters if it’s automatic and consistent.",
  },
  low_financial_awareness: {
    title: "Low financial awareness (checking accounts rarely)",
    advice:
      "Not checking your accounts makes it easy to miss fees and overspending. Try a weekly 5-minute ‘money check’: open your accounts and just look, without judging.",
  },
  no_written_goals: {
    title: "No written financial goals",
    advice:
      "Goals only in your head are easy to forget. Write down 1–3 specific goals (amount + deadline) and review them monthly inside your Goal Planner.",
  },
  no_direction: {
    title: "Reacting month by month with no direction",
    advice:
      "Living month-to-month makes long-term progress slow. Choose one focus for the next 3–6 months (e.g., build a $200 emergency fund) and align your budget with it.",
  },
  avoid_money_review: {
    title: "Avoiding looking at your money when stressed",
    advice:
      "Avoidance is natural but keeps mistakes repeating. Create a safe, short ‘money review’ ritual: 10 minutes, once a week, with a drink or music you like.",
  },
  no_spending_strategy: {
    title: "No clear strategy for using credit vs. debit",
    advice:
      "Using credit randomly can lead to hidden balances. Decide rules: for example, use debit for daily spending, credit only for planned purchases within budget.",
  },
  missed_savings: {
    title: "Leaving easy savings on the table",
    advice:
      "Not comparing prices or canceling unused subscriptions wastes money. Once a month, review: ‘Do I still use this?’ and compare prices for any big upcoming purchase.",
  },
  wasted_subscriptions: {
    title: "Paying for unused subscriptions",
    advice:
      "Old subscriptions are silent leaks. List all recurring charges and cancel the ones you don’t use. Re-check every 3–6 months.",
  },
  underestimate_debt: {
    title: "Focusing only on monthly payments, not total cost",
    advice:
      "A small monthly payment can hide a huge total cost. Before taking new debt, look at total interest over time and ask: ‘Is there a simpler, cheaper option?’",
  },
  no_investing_plan: {
    title: "No simple long-term investing plan",
    advice:
      "Without a basic investing plan, your money may lose buying power to inflation. Once your emergency fund is started, consider a small monthly investment into a diversified, low-cost fund.",
  },
  no_automation: {
    title: "Relying only on willpower, not automation",
    advice:
      "Doing everything manually is tiring and easy to forget. Automate at least one step: savings, investment, or bill payment, so good choices happen even on busy days.",
  },
  low_financial_education: {
    title: "Not learning about money regularly",
    advice:
      "Money skills are learnable. Choose one simple resource (podcast, YouTube channel, or article series) and spend 15–30 minutes per week learning.",
  },
  repeat_mistakes: {
    title: "Repeating the same mistakes without reflection",
    advice:
      "Everyone makes money mistakes. The key is to review them. Once a month, ask: ‘What went wrong? What will I do differently next time?’ and write down 1–2 new habits.",
  },
};

export default function AIMistakeLearner() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    setError("");
    setResult(null);

    const unanswered = QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const tagCounts = {};
    QUESTIONS.forEach((q) => {
      const chosenId = answers[q.id];
      const option = q.options.find((o) => o.id === chosenId);
      if (option && option.tags) {
        option.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const detected = Object.entries(tagCounts)
      .filter(([tag, count]) => count > 0 && MISTAKE_DEFINITIONS[tag])
      .map(([tag, count]) => ({
        tag,
        count,
        ...MISTAKE_DEFINITIONS[tag],
      }))
      .sort((a, b) => b.count - a.count);

    setResult({
      mistakes: detected,
      totalTags: Object.keys(tagCounts).length,
    });
  };

  return (
    <div>
      <h2>AI Mistake-Learner</h2>
      <p className="section-subtitle">
        Answer a questionnaire about your money habits. We&apos;ll highlight repeated patterns and suggest how to avoid the same mistakes.
      </p>

      {/* 问题按顺序自然向下排列，整页变长 */}
      <div className="mistake-quiz">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="mistake-question">
            <div className="mistake-question-title">
              {index + 1}. {q.text}
            </div>
            <select
              className="mistake-select"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            >
              <option value="" disabled>
                Select an answer...
              </option>
              {q.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button className="primary-btn" onClick={handleSubmit}>
        Submit &amp; Analyze Patterns
      </button>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="tax-result" style={{ marginTop: "16px" }}>
          {result.mistakes.length === 0 ? (
            <p>
              We did not detect strong negative patterns from your answers. Keep
              building good habits and reviewing your money regularly.
            </p>
          ) : (
            <>
              <h3>Patterns to Watch</h3>
              <p>
                Based on your answers, you may be repeating some of these
                mistakes. Start with the top 2–3 items below.
              </p>
              <ul className="mistake-result-list">
                {result.mistakes.map((m) => (
                  <li key={m.tag} className="mistake-result-item">
                    <h4>{m.title}</h4>
                    <p>{m.advice}</p>
                    <p className="mistake-tag-count">
                      Detected in <strong>{m.count}</strong> of your answers.
                    </p>
                  </li>
                ))}
              </ul>
              <p className="tax-note">
                This tool uses simple rule-based logic, not real psychological
                profiling. Use it as a reflection guide, not a judgment.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
