public static class UserData
{
    public static string username { get; set; }
    public static string name { get; set; }
    public static int score { get; set; }
    public static string token { get; set; }
}

public class LoginData
{
    public string username { get; set; }
    public string password { get; set; }
}

public class RegisterData
{
    public string name { get; set; }
    public string email { get; set; }
    public string username { get; set; }
    public string password { get; set; }
}

public class UserInfo
{
    public string username { get; set; }
    public string name { get; set; }
    public int score { get; set; }
}

public class LoginResponse
{
    public UserInfo user { get; set; }
    public string token { get; set; }
}

public class RegisterResponse
{
    public string username { get; set; }
}

public class ExceptionResponse
{
    public string message { get; set; }
}

public class UpdateData
{
    public string username { get; set; }
    public int score { get; set; }
    public string token { get; set; }
}

public class ScoreData
{
    public string username { get; set; }
    public string token { get; set; }
}

public class ScoreResponse
{
    public string message { get; set; }
    public int score { get; set; }
}