using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PM.server.Data;
using PM.server.Model;

namespace PM.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]                              // any authenticated user
    public class ProductController(ProductDbContext context) : ControllerBase
    {
        private readonly ProductDbContext _context = context;

        /* ─────────────────────────────  READ  ───────────────────────────── */

        // → Authenticated User OR Admin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts() =>
            await _context.Products.ToListAsync();

        // → Authenticated User OR Admin
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? NotFound() : product;
        }

        /* ───────────────────────────── MUTATIONS (Admin only) ───────────── */

        [Authorize(Roles = "Admin")]
        [HttpPost("AddProduct")]
        public async Task<ActionResult<Product>> AddProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest();
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("UploadImage")]
        [RequestSizeLimit(50 * 1024 * 1024)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var ext = Path.GetExtension(file.FileName).ToLower();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            if (!allowed.Contains(ext))
                return BadRequest("Invalid file type");

            var fileName = $"{Guid.NewGuid()}{ext}";
            var savePath = Path.Combine("wwwroot", "images", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);
            await using var stream = System.IO.File.Create(savePath);
            await file.CopyToAsync(stream);

            var url = $"{Request.Scheme}://{Request.Host}/images/{fileName}";
            return Ok(new { imageUrl = url });

        }
    }
}
