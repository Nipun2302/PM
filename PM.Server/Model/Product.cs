﻿namespace PM.server.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }
    }
}
