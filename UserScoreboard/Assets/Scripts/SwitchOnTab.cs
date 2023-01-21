using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine;

public class SwitchOnTab : MonoBehaviour
{
    EventSystem system;
    Selectable next;
    // Start is called before the first frame update
    void Start()
    {
        system = EventSystem.current;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Tab))
        {
            next = system.currentSelectedGameObject.GetComponent<Selectable>().FindSelectableOnDown();
            if (next != null)
            {
                InputField inputField = next.GetComponent<InputField>();
                if (inputField != null)
                    inputField.OnPointerClick(new PointerEventData(system));
                system.SetSelectedGameObject(next.gameObject, new BaseEventData(system));
            }
        }
    }
}
