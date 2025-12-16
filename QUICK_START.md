# Quick Start Guide 🚀

## Installation

1. **Activate your virtual environment**:
   ```bash
   .\venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the App

```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

## Using the App

### 1. Dashboard 📊
- View your carbon footprint overview
- See daily trends and category breakdowns
- Monitor today's impact with a gauge chart

### 2. Track Activity ➕
Select a category and log your activity:

**Transportation 🚗**
- Choose mode (car, bus, train, bike, etc.)
- Enter distance in km
- Get instant carbon calculation

**Energy ⚡**
- Select energy type (electricity, gas, solar, etc.)
- Enter consumption in kWh
- See your carbon footprint

**Food 🍽️**
- Pick food type (beef, vegetables, etc.)
- Enter amount in kg or liters
- View environmental impact

**Waste ♻️**
- Choose disposal method (landfill, recycled, etc.)
- Enter amount in kg
- Calculate emissions

### 3. History 📅
- View all logged activities
- Filter by category and date range
- Delete activities
- Export data to CSV

### 4. Recommendations 💡
- Get personalized tips based on your usage
- See potential carbon savings
- Learn general sustainability practices

## Tips for Best Results

1. **Log activities daily** for accurate tracking
2. **Be consistent** with your measurements
3. **Review recommendations** regularly
4. **Track progress** over time
5. **Export data** periodically for backup

## Troubleshooting

**App won't start?**
- Make sure you've activated the virtual environment
- Check that all dependencies are installed

**Database errors?**
- The database file will be created automatically on first run
- Make sure you have write permissions in the app directory

**Charts not showing?**
- You need to log some activities first
- Check that your date range includes logged activities

---

**Need help?** Check the README.md for more detailed information.
