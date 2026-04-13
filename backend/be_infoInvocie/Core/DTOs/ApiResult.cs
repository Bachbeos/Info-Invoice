namespace be_infoInvoice.Core.DTOs
{
    public class ApiResult<T>
    {
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data {  get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;

        public static ApiResult<T> Success(T data, string message="Thành công") => new() { Code = 200, Data = data, Message = message };
        public static ApiResult<T> Failure(int code, string message) => new() { Code = code, Message = message };
    }
}
