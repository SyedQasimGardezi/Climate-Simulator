import sqlite3
from datetime import datetime
import pandas as pd
from .config import DATABASE_NAME

class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_tables()
    
    def connect(self):
        """Connect to SQLite database"""
        self.conn = sqlite3.connect(DATABASE_NAME, check_same_thread=False)
        self.cursor = self.conn.cursor()
    
    def create_tables(self):
        """Create necessary tables if they don't exist"""
        # Activities table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT NOT NULL,
                amount REAL NOT NULL,
                unit TEXT NOT NULL,
                carbon_footprint REAL NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL
            )
        ''')
        self.conn.commit()
    
    def add_activity(self, date, category, subcategory, amount, unit, carbon_footprint, notes=''):
        """Add a new activity to the database"""
        created_at = datetime.now().isoformat()
        self.cursor.execute('''
            INSERT INTO activities (date, category, subcategory, amount, unit, carbon_footprint, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (date, category, subcategory, amount, unit, carbon_footprint, notes, created_at))
        self.conn.commit()
        return self.cursor.lastrowid
    
    def get_all_activities(self):
        """Get all activities from the database"""
        query = '''
            SELECT id, date, category, subcategory, amount, unit, carbon_footprint, notes, created_at
            FROM activities
            ORDER BY date DESC, created_at DESC
        '''
        df = pd.read_sql_query(query, self.conn)
        return df
    
    def get_activities_by_date_range(self, start_date, end_date):
        """Get activities within a date range"""
        query = '''
            SELECT id, date, category, subcategory, amount, unit, carbon_footprint, notes, created_at
            FROM activities
            WHERE date BETWEEN ? AND ?
            ORDER BY date DESC, created_at DESC
        '''
        df = pd.read_sql_query(query, self.conn, params=(start_date, end_date))
        return df
    
    def get_activities_by_category(self, category):
        """Get activities by category"""
        query = '''
            SELECT id, date, category, subcategory, amount, unit, carbon_footprint, notes, created_at
            FROM activities
            WHERE category = ?
            ORDER BY date DESC, created_at DESC
        '''
        df = pd.read_sql_query(query, self.conn, params=(category,))
        return df
    
    def delete_activity(self, activity_id):
        """Delete an activity by ID"""
        self.cursor.execute('DELETE FROM activities WHERE id = ?', (activity_id,))
        self.conn.commit()
    
    def get_total_carbon_by_date(self, date):
        """Get total carbon footprint for a specific date"""
        query = '''
            SELECT SUM(carbon_footprint) as total
            FROM activities
            WHERE date = ?
        '''
        result = self.cursor.execute(query, (date,)).fetchone()
        return result[0] if result[0] else 0.0
    
    def get_total_carbon_by_category(self, start_date, end_date):
        """Get total carbon footprint by category within a date range"""
        query = '''
            SELECT category, SUM(carbon_footprint) as total
            FROM activities
            WHERE date BETWEEN ? AND ?
            GROUP BY category
        '''
        df = pd.read_sql_query(query, self.conn, params=(start_date, end_date))
        return df
    
    def get_daily_totals(self, start_date, end_date):
        """Get daily carbon footprint totals within a date range"""
        query = '''
            SELECT date, SUM(carbon_footprint) as total
            FROM activities
            WHERE date BETWEEN ? AND ?
            GROUP BY date
            ORDER BY date
        '''
        df = pd.read_sql_query(query, self.conn, params=(start_date, end_date))
        return df
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
