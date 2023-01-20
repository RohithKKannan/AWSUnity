using System;
using UnityEngine;
using System.Threading.Tasks;
using UnityEngine.Networking;
using Newtonsoft.Json;
using TMPro;

//Newtonsoft json : com.unity.nuget.newtonsoft-json@3.0

public class WebHandler : MonoBehaviour
{
    [Header("Panels")]
    [SerializeField] GameObject profilePanel;
    [SerializeField] GameObject loginPanel;
    [SerializeField] GameObject registerPanel;
    [Header("Register Form")]
    [SerializeField] TMP_InputField register_name;
    [SerializeField] TMP_InputField register_email;
    [SerializeField] TMP_InputField register_username;
    [SerializeField] TMP_InputField register_password;
    [SerializeField] TMP_Text register_warning;
    [SerializeField] TMP_Text register_status;
    [Header("Login Form")]
    [SerializeField] TMP_InputField login_username;
    [SerializeField] TMP_InputField login_password;
    [SerializeField] TMP_Text login_warning;
    [SerializeField] TMP_Text login_status;
    [Header("Profile Panel")]
    [SerializeField] TMP_Text welcome;
    [SerializeField] TMP_Text score;
    [SerializeField] TMP_InputField new_score;
    [SerializeField] TMP_Text update_warning;
    [SerializeField] TMP_Text update_status;

    /*
    JSON object for login
    {
        username: username,
        password: password
    }
    JSON object for register
    {
        name: name,
        email: email,
        username: username,
        password: password
    }
    
    */

    [ContextMenu("Check Health")]
    public async void CheckHealth()
    {
        string url = "https://d5wp9i5f63.execute-api.ap-south-1.amazonaws.com/prod/verify";

        UnityWebRequest www = UnityWebRequest.Get(url);

        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("x-api-key", "U9a559ywOva6diEIthuCc5LYdEvxY49P6bYhmrwF");

        var operation = www.SendWebRequest();

        while (!operation.isDone)
            await Task.Yield();

        var jsonResponse = www.downloadHandler.text;

        if (www.result != UnityWebRequest.Result.Success)
            Debug.LogError($"Failure: {www.error}");

        try
        {
            Debug.Log($"Completed: {www.downloadHandler.text}");
        }
        catch (Exception e)
        {
            Debug.Log($"{e.Message}");
        }
    }


    [ContextMenu("Login User")]
    public async void LoginUser()
    {
        string url = "https://d5wp9i5f63.execute-api.ap-south-1.amazonaws.com/prod/login";

        if (login_username.text == "" || login_password.text == "")
        {
            // Debug.Log("Enter all input!");
            login_warning.text = "Some fields are empty!";
            if (!login_warning.gameObject.activeInHierarchy)
                login_warning.gameObject.SetActive(true);
            if (login_status.gameObject.activeInHierarchy)
                login_status.gameObject.SetActive(false);
            return;
        }
        else
        {
            if (login_warning.gameObject.activeInHierarchy)
                login_warning.gameObject.SetActive(false);

        }

        LoginData loginData = new LoginData();
        loginData.username = login_username.text;
        loginData.password = login_password.text;

        // Debug.Log("username : " + loginData.username);
        // Debug.Log("password : " + loginData.password);

        var body = JsonConvert.SerializeObject(loginData);

        UnityWebRequest www = UnityWebRequest.Put(url, body);
        www.method = "POST";
        //set get / post method

        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("x-api-key", "U9a559ywOva6diEIthuCc5LYdEvxY49P6bYhmrwF");
        //setting content type - let unity know that we are dealing with json response type
        //setting api key

        var operation = www.SendWebRequest();

        //request is sent to server
        //response is not received immediately

        //async indicates the function has an await usage
        //await initiates a Task in a non blocking way
        //continues execution when Task completes

        while (!operation.isDone)
            await Task.Yield();

        /////////////////////////////////////////////////////////////////////////////////////////////// Response received

        var jsonResponse = www.downloadHandler.text;

        if (www.result != UnityWebRequest.Result.Success)
            Debug.LogError($"Failure: {www.error}");

        //Now to deserialize Json to .NET Object to use the content
        //Newtonsoft Json Package install - com.unity.nuget.newtonsoft-json@3.0

        //catch and handle exception generated by working code
        //try block contains code that may trigger an exception

        try
        {
            var result = JsonConvert.DeserializeObject<LoginResponse>(jsonResponse);
            // Debug.Log("Completed: " + result.user.username + '\n');
            // Debug.Log($"Success: {www.downloadHandler.text}");
            login_status.text = result.user.username;
            UserData.username = result.user.username;
            UserData.name = result.user.name;
            UserData.token = result.token;
            if (!login_status.gameObject.activeInHierarchy)
                login_status.gameObject.SetActive(true);
            ProfileView();
        }
        catch (Exception e)
        {
            var result = JsonConvert.DeserializeObject<ExceptionResponse>(jsonResponse);
            Debug.LogError($"Could not parse response {result.message}. {e.Message}");
            login_warning.text = result.message;
            if (!login_warning.gameObject.activeInHierarchy)
                login_warning.gameObject.SetActive(true);
            if (login_status.gameObject.activeInHierarchy)
                login_status.gameObject.SetActive(false);
            return;
        }
        //Create User Data class with member variables names same as that of json object
    }

    void ProfileView()
    {
        welcome.text = $"Hi {UserData.username}! Welcome back";
        score.text = "Your score is : " + UserData.score;
        registerPanel.gameObject.SetActive(false);
        loginPanel.gameObject.SetActive(false);
        profilePanel.gameObject.SetActive(true);
    }

    void LoginView()
    {
        registerPanel.gameObject.SetActive(true);
        loginPanel.gameObject.SetActive(true);
        profilePanel.gameObject.SetActive(false);
    }

    public void LogoutUser()
    {
        UserData.username = "";
        UserData.name = "";
        UserData.score = 0;
        UserData.token = "";
        LoginView();
    }

    [ContextMenu("Register User")]
    public async void RegisterUser()
    {
        string url = "https://d5wp9i5f63.execute-api.ap-south-1.amazonaws.com/prod/register";

        if (register_name.text == "" || register_email.text == "" || register_username.text == "" || register_password.text == "")
        {
            // Debug.Log("Enter all input!");
            register_warning.text = "Some fields are empty!";
            if (!register_warning.gameObject.activeInHierarchy)
                register_warning.gameObject.SetActive(true);
            if (register_status.gameObject.activeInHierarchy)
                register_status.gameObject.SetActive(false);
            return;
        }
        else
        {
            if (register_warning.gameObject.activeInHierarchy)
                register_warning.gameObject.SetActive(false);
        }

        RegisterData registerData = new RegisterData();
        registerData.name = register_name.text;
        registerData.email = register_email.text;
        registerData.username = register_username.text;
        registerData.password = register_password.text;

        UnityWebRequest www = UnityWebRequest.Put(url, JsonConvert.SerializeObject(registerData));

        www.method = "POST";

        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("x-api-key", "U9a559ywOva6diEIthuCc5LYdEvxY49P6bYhmrwF");

        var operation = www.SendWebRequest();

        while (!operation.isDone)
            await Task.Yield();

        var jsonResponse = www.downloadHandler.text;

        if (www.result != UnityWebRequest.Result.Success)
            Debug.LogError($"Failure : {www.error}");

        try
        {
            var result = JsonConvert.DeserializeObject<RegisterResponse>(jsonResponse);
            // Debug.Log($"Success: {www.downloadHandler.text}");
            register_status.text = result.username;
            if (!register_status.gameObject.activeInHierarchy)
                register_status.gameObject.SetActive(true);
        }
        catch (Exception e)
        {
            var result = JsonConvert.DeserializeObject<ExceptionResponse>(jsonResponse);
            Debug.LogError($"Could not parse response {result.message}. {e.Message}");
            register_warning.text = result.message;
            if (!register_warning.gameObject.activeInHierarchy)
                register_warning.gameObject.SetActive(true);
            if (register_status.gameObject.activeInHierarchy)
                register_status.gameObject.SetActive(false);
            return;
        }
    }

    public async void updateScore()
    {
        string url = "https://d5wp9i5f63.execute-api.ap-south-1.amazonaws.com/prod/update";

        if (new_score.text == "" || !int.TryParse(new_score.text, out int n))
        {
            update_warning.text = "Enter a valid score to update!";
            if (!update_warning.gameObject.activeInHierarchy)
                update_warning.gameObject.SetActive(true);
            if (update_status.gameObject.activeInHierarchy)
                update_status.gameObject.SetActive(false);
        }
        else
        {
            if (update_warning.gameObject.activeInHierarchy)
                update_warning.gameObject.SetActive(false);
        }

        UpdateData updateData = new UpdateData();
        updateData.username = UserData.username;
        updateData.score = int.Parse(new_score.text);
        updateData.token = UserData.token;

        var body = JsonConvert.SerializeObject(updateData);

        UnityWebRequest www = UnityWebRequest.Put(url, body);

        www.method = "PUT";

        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("x-api-key", "U9a559ywOva6diEIthuCc5LYdEvxY49P6bYhmrwF");

        var operation = www.SendWebRequest();

        while (!operation.isDone)
            await Task.Yield();

        var jsonResponse = www.downloadHandler.text;

        if (www.result != UnityWebRequest.Result.Success)
            Debug.LogError($"Failure : {www.error}");

        try
        {
            update_status.text = "Update successfull!";
            if (!update_status.gameObject.activeInHierarchy)
                update_status.gameObject.SetActive(true);
            Debug.Log("Success");
        }
        catch (Exception e)
        {
            var result = JsonConvert.DeserializeObject<ExceptionResponse>(jsonResponse);
            Debug.LogError($"Could not parse response {result.message}. {e.Message}");
            update_warning.text = result.message;
            if (!update_warning.gameObject.activeInHierarchy)
                update_warning.gameObject.SetActive(true);
            if (update_status.gameObject.activeInHierarchy)
                update_status.gameObject.SetActive(false);
            return;
        }
    }
}
