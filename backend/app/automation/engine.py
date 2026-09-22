from typing import List, Dict, Any

class AutomationEngine:
    """Evaluates triggers (e.g. Lead Created, Score > 80, Sentiment = Negative) and executes automated actions."""

    @staticmethod
    def evaluate_rule(automation: Dict[str, Any], event_data: Dict[str, Any]) -> bool:
        trigger = automation.get("trigger")
        event_type = event_data.get("event_type")

        if trigger != event_type:
            return False

        conditions = automation.get("conditions", [])
        for cond in conditions:
            field = cond.get("field")
            operator = cond.get("operator")
            val = cond.get("value")

            actual_val = event_data.get(field)
            if actual_val is None:
                continue

            if operator == ">" and not (actual_val > val):
                return False
            elif operator == "<" and not (actual_val < val):
                return False
            elif operator == "==" and not (actual_val == val):
                return False
            elif operator == "contains" and not (val in str(actual_val)):
                return False

        return True

    @staticmethod
    def execute_actions(actions: List[Dict[str, Any]], event_data: Dict[str, Any]) -> List[str]:
        logs = []
        for act in actions:
            act_type = act.get("type")
            if act_type == "assign_user":
                target = act.get("target", "Sales Manager")
                logs.append(f"Action Executed: Assigned item to {target}")
            elif act_type == "create_task":
                title = act.get("task_title", "Automated Follow-up")
                logs.append(f"Action Executed: Created Task '{title}'")
            elif act_type == "generate_ai_reply":
                logs.append("Action Executed: Triggered AI Smart Reply draft")
            elif act_type == "send_notification":
                msg = act.get("message", "Workflow alert")
                logs.append(f"Action Executed: Sent notification '{msg}'")
            else:
                logs.append(f"Action Executed: Custom action '{act_type}' triggered")
        return logs
