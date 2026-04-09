namespace be_infoInvoice.Core.DTOs
{
    public class ApiResult<T>
    {
        public bool IsSuccess { get; set; }
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data {  get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;

        public static ApiResult<T> Success(T data, string message="Thành công") => new() { IsSuccess = true, Code = 200, Data = data, Message = message };
        public static ApiResult<T> Failure(int code, string message) => new() { IsSuccess =  false, Code = code, Message = message };
    }
}
